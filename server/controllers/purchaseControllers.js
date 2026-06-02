import prisma from "../lib/prisma.js";
import AppError from "../lib/utils/AppError.js";

const createPurchase = async (req, res) => {
  const {
    supplierId,
    items,
    note,
    paidAmount,
    paymentMethod = "CASH",
  } = req.body;
  const createdBy = req.user.id;
  console.log(req.body, "req.body");

  const productIds = items.map((item) => item.productId);

  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
  });

  if (products.length !== items.length) {
    throw new AppError("Product not found", 404);
  }

  let subTotal = 0;
  let totalAmount = 0;
  let walletDeduction = 0;

  for (let item of items) {
    subTotal += item.unitCost * item.quantity;
  }

  totalAmount = subTotal;
  let dueAmount = totalAmount > paidAmount ? totalAmount - paidAmount : 0;

  const purchaseCoutner = await prisma.purchaseCounter.upsert({
    where: { name: "PURCHASE_COUNTER" },
    update: { value: { increment: 1 } },
    create: { name: "PURCHASE_COUNTER", value: 1 },
  });

  const purchaseNumber = `PUR-${String(purchaseCoutner.value).padStart(
    4,
    "0",
  )}`;

  if (supplierId) {
    const supplier = await prisma.supplier.findUnique({
      where: { id: supplierId },
    });

    if (supplier.walletBalance > 0 && dueAmount > 0) {
      walletDeduction = Math.min(supplier.walletBalance, dueAmount);
      dueAmount = dueAmount - walletDeduction;
    }
  }

  const result = await prisma.$transaction(async (tx) => {
    // update product stock
    for (let item of items) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { increment: item.quantity } },
      });
    }

    await tx.supplier.update({
      where: { id: supplierId },
      data: {
        walletBalance: { decrement: walletDeduction },
        totalDue: { increment: dueAmount },
        totalSpent: { increment: totalAmount },
      },
    });

    const orderDate = new Date();
    orderDate.setHours(0, 0, 0, 0);
    const monthLabel = orderDate.toLocaleString("en-US", { month: "short" });
    const currentYear = orderDate.getFullYear();

    // create purchase
    const purchase = await tx.purchase.create({
      data: {
        supplierId,
        subTotal,
        total: totalAmount,
        note,
        createdBy,
        dueAmount,
        purchaseNumber,
        paymentMethod,
        items: {
          create: items.map((item) => ({
            ...item,
            total: item.unitCost * item.quantity,
          })),
        },
        date: orderDate,
        month: monthLabel,
        year: currentYear,
      },
    });

    return purchase;
  });

  res.status(201).json({
    success: true,
    message: "Purchase created successfully",
    data: result,
  });
};

const getPurchases = async (req, res) => {
  const {
    search,
    status,
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = req.query;

  const skip = (Number(page) - 1) * Number(limit);

  const where = {
    ...(search
      ? {
          OR: [
            { purchaseNumber: { contains: search, mode: "insensitive" } },
            { supplier: { name: { contains: search, mode: "insensitive" } } },
          ],
        }
      : {}),
    ...(status ? { status } : {}),
  };

  const [purchases, totalPurchases] = await Promise.all([
    prisma.purchase.findMany({
      where,
      include: {
        supplier: true,
      },
      orderBy: {
        [sortBy]: sortOrder,
      },
      skip: skip,
      take: Number(limit),
    }),
    prisma.purchase.count({ where }),
  ]);

  res.status(200).json({
    success: true,
    message: "Purchases retrieved successfully",
    count: totalPurchases,
    data: purchases,
  });
};

const getPurchaseById = async (req, res) => {
  const { id } = req.params;
  const purchase = await prisma.purchase.findUnique({
    where: { id },
    include: {
      supplier: true,
      items: true,
    },
  });
  res.status(200).json({
    success: true,
    message: "Purchase retrieved successfully",
    data: purchase,
  });
};

const updatePurchase = async (req, res) => {
  const { id } = req.params;
  const purchase = await prisma.purchase.update({
    where: { id },
    data: { ...req.body },
  });
  res.status(200).json({
    success: true,
    message: "Purchase updated successfully",
    data: purchase,
  });
};

const deletePurchase = async (req, res) => {
  const { id } = req.params;
  await prisma.purchase.delete({
    where: { id },
  });
  res.status(200).json({
    success: true,
    message: "Purchase deleted successfully",
  });
};

export {
  createPurchase,
  getPurchases,
  getPurchaseById,
  updatePurchase,
  deletePurchase,
};
