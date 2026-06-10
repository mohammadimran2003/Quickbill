import calculateReturnMetrics from "../lib/calculateReturnMetrics.js";
import prisma from "../lib/prisma.js";
import AppError from "../lib/utils/AppError.js";

const createPurchase = async (req, res) => {
  const {
    supplierId,
    items,
    note,
    paidAmount,
    paymentMethod = "CASH",
    status,
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

  const result = await prisma.$transaction(async (tx) => {
    const supplier = supplierId
      ? await tx.supplier.findUnique({ where: { id: supplierId } })
      : null;

    let walletDeduction = 0;
    let finalDue = 0;
    let advanceAmount = 0;

    let currentPaid = Number(paidAmount) || 0;

    if (totalAmount > currentPaid) {
      finalDue = totalAmount - currentPaid;

      if (supplier && supplier.walletBalance > 0) {
        walletDeduction = Math.min(Number(supplier.walletBalance), finalDue);
        finalDue -= walletDeduction;
        currentPaid += walletDeduction;
      }
    } else if (currentPaid > totalAmount) {
      advanceAmount = currentPaid - totalAmount;
    }

    if (status === "RECEIVED") {
      for (let item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { increment: item.quantity } },
        });
      }
    }

    if (supplierId) {
      await tx.supplier.update({
        where: { id: supplierId },
        data: {
          walletBalance:
            advanceAmount > 0
              ? { increment: advanceAmount }
              : { decrement: walletDeduction },
          totalDue: { increment: finalDue },
          totalSpent: { increment: totalAmount },
        },
      });
    }
    const purchaseCoutner = await tx.purchaseCounter.upsert({
      where: { name: "PURCHASE_COUNTER" },
      update: { value: { increment: 1 } },
      create: { name: "PURCHASE_COUNTER", value: 1 },
    });

    const purchaseNumber = `PUR-${String(purchaseCoutner.value).padStart(4, "0")}`;

    const orderDate = new Date();
    const monthLabel = orderDate.toLocaleString("en-US", { month: "short" });
    const currentYear = orderDate.getFullYear();

    return await tx.purchase.create({
      data: {
        supplierId,
        subTotal,
        total: totalAmount,
        dueAmount: finalDue,
        paidAmount: currentPaid,
        note,
        status,
        createdBy,
        purchaseNumber,
        paymentMethod,
        items: {
          create: items.map((item) => ({
            productName: item.productName,
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
      items: {
        include: {
          product: {
            select: {
              stock: true,
            },
          },
        },
      },
      returns: {
        include: { items: true },
      },
    },
  });

  const purchaseWithReturnMetrics = calculateReturnMetrics(purchase);

  const { returns, ...cleanPurchaseData } = purchase;
  cleanPurchaseData.items = purchaseWithReturnMetrics;

  console.log(purchaseWithReturnMetrics, "purchaseWithRegturnMetrics");

  res.status(200).json({
    success: true,
    message: "Purchase retrieved successfully",
    data: cleanPurchaseData,
  });
};

const updatePurchase = async (req, res) => {
  const { id } = req.params;

  const { items, supplier, ...purchaseData } = req.body;

  const updatedPurchase = await prisma.$transaction(async (tx) => {
    const purchaseUpdate = await tx.purchase.update({
      where: { id },
      data: purchaseData,
    });

    if (items && Array.isArray(items)) {
      for (const item of items) {
        const {
          id: itemId,
          productId,
          productName,
          quantity,
          returnedQty,
          unitCost,
          total,
        } = item;

        await tx.purchaseItem.update({
          where: { id: itemId },
          data: {
            productId,
            productName,
            quantity,
            returnedQty,
            unitCost,
            total,
          },
        });

        await tx.product.update({
          where: { id: productId },
          data: {
            stock: {
              increment: quantity,
            },
          },
        });
      }
    }

    return purchaseUpdate;
  });

  res.status(200).json({
    success: true,
    message: "Purchase updated successfully",
    data: updatedPurchase,
  });
};

export { createPurchase, getPurchases, getPurchaseById, updatePurchase };
