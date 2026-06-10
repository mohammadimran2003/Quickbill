export async function handleSaleReturn(
  tx,
  { items, customerId, walkInCustomerId, orderId, totalAmount, grandTotal },
) {
  for (const item of items) {
    const originalOrderItem = await tx.orderItem.findUnique({
      where: { id: item.orderItemId },
      select: {
        quantity: true,
        returnedQty: true,
        product: { select: { name: true } },
      },
    });

    if (!originalOrderItem) {
      throw new Error(`Order item not found for ID: ${item.orderItemId}`);
    }

    const totalTargetReturn =
      (originalOrderItem.returnedQty || 0) + item.quantity;
    if (totalTargetReturn > originalOrderItem.quantity) {
      throw new Error(
        `Cannot return more than original quantity for: ${originalOrderItem.product.name}`,
      );
    }

    await tx.product.update({
      where: { id: item.productId },
      data: { stock: { increment: item.quantity } },
    });

    await tx.orderItem.update({
      where: { id: item.orderItemId },
      data: { returnedQty: { increment: item.quantity } },
    });
  }

  if (customerId && customerId !== walkInCustomerId) {
    await tx.customer.update({
      where: { id: customerId },
      data: { totalSpent: { decrement: grandTotal } },
    });

    if (orderId) {
      await tx.order.update({
        where: { id: orderId },
        data: {
          subtotal: { decrement: totalAmount },
          total: { decrement: totalAmount },
        },
      });
    }
  }
}
