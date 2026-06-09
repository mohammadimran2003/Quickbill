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

  const productIds = items.map((item) => item.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
  });

  if (products.length !== items.length) {
    throw new AppError("One or more products not found", 404);
  }

  let subTotal = items.reduce(
    (acc, item) => acc + item.unitCost * item.quantity,
    0,
  );
  let totalAmount = subTotal;
  console.log(totalAmount, "total amount for");

  const purchaseCoutner = await prisma.purchaseCounter.upsert({
    where: { name: "PURCHASE_COUNTER" },
    update: { value: { increment: 1 } },
    create: { name: "PURCHASE_COUNTER", value: 1 },
  });

  const purchaseNumber = `PUR-${String(purchaseCoutner.value).padStart(4, "0")}`;

  const result = await prisma.$transaction(async (tx) => {
    const supplier = supplierId
      ? await tx.supplier.findUnique({ where: { id: supplierId } })
      : null;

    let walletDeduction = 0;

    let finalDue = 0;

    if (paidAmount && totalAmount > paidAmount) {
      finalDue = totalAmount - paidAmount;
    }

    if (supplier && supplier.walletBalance > 0 && finalDue > 0) {
      walletDeduction = Math.min(Number(supplier.walletBalance), finalDue);
      finalDue = finalDue - walletDeduction;
    }

    for (let item of items) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { increment: item.quantity } },
      });
    }

    if (supplierId) {
      await tx.supplier.update({
        where: { id: supplierId },
        data: {
          walletBalance: { decrement: walletDeduction },
          totalDue: { increment: finalDue },
          totalSpent: { increment: totalAmount },
        },
      });
    }

    const orderDate = new Date();
    const monthLabel = orderDate.toLocaleString("en-US", { month: "short" });
    const currentYear = orderDate.getFullYear();
    console.log(walletDeduction, "walletdeduction");

    return await tx.purchase.create({
      data: {
        supplierId,
        subTotal,
        total: totalAmount,
        dueAmount: finalDue,
        note,
        createdBy,
        purchaseNumber,
        paymentMethod,
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitCost: item.unitCost,
            total: item.unitCost * item.quantity,
          })),
        },
        date: orderDate,
        month: monthLabel,
        year: currentYear,
      },
    });
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
