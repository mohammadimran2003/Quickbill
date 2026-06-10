import AppError from "../utils/AppError.js";

export async function handlePurchaseReturn(
  tx,
  { items, supplierId, purchaseId, totalAmount, grandTotal },
) {
  const purchase = await tx.purchase.findUnique({
    where: { id: purchaseId },
    include: { items: true },
  });

  if (!purchase) {
    throw new AppError("Purchase not found", 404);
  }

  if (purchase.status === "CANCELLED") {
    throw new AppError("Purchase already cancelled", 400);
  }

  for (const item of items) {
    const originalPurchaseItem = await tx.purchaseItem.findUnique({
      where: { id: item.purchaseItemId },
      select: {
        quantity: true,
        returnedQty: true,
        product: { select: { name: true } },
      },
    });

    if (!originalPurchaseItem) {
      throw new AppError(
        `Purchase item not found for ID: ${item.purchaseItemId}`,
        404,
      );
    }

    const totalTargetReturn =
      (originalPurchaseItem.returnedQty || 0) + item.quantity;

    if (totalTargetReturn > originalPurchaseItem.quantity) {
      throw new AppError(
        `Cannot return more than original quantity for: ${originalPurchaseItem.product.name}`,
        400,
      );
    }

    if (purchase.status === "RECEIVED") {
      const product = await tx.product.findUnique({
        where: { id: item.productId },
        select: { stock: true, name: true },
      });

      if (!product) {
        throw new AppError(`Product not found`, 404);
      }

      if (product.stock < item.quantity) {
        throw new AppError(
          `Products from this purchase have already been sold. Only ${product.stock} units of ${product.name} are currently in stock, so it is not possible to return ${item.quantity} units.`,
          400,
        );
      }

      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    await tx.purchaseItem.update({
      where: { id: item.purchaseItemId },
      data: { returnedQty: { increment: item.quantity } },
    });
  }

  if (supplierId) {
    await tx.supplier.update({
      where: { id: supplierId },
      data: { totalSpent: { decrement: grandTotal } },
    });

    if (purchaseId) {
      await tx.purchase.update({
        where: { id: purchaseId },
        data: { total: { decrement: totalAmount } },
      });
    }
  }
}
