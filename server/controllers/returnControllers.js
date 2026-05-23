import prisma from "../lib/prisma.js";

const createReturn = async (req, res) => {
  try {
    const {
      orderId,
      customerId,
      purchaseId,
      supplierId,
      items,
      reason,
      tax = 0,
    } = req.body;
    const createdBy = req.user.id;

    const totalAmount = items.reduce(
      (total, item) => total + item.quantity * item.price,
      0,
    );

    let returnType = "SALE";
    if (purchaseId) {
      returnType = "PURCHASE";
    }

    const walkInCustomer = await prisma.customer.findUnique({
      where: { phone: "walk-in" },
    });

    const grandTotal = totalAmount + tax;

    const returnCounter = await prisma.returnCounter.upsert({
      where: { name: "returnCounter" },
      update: { currentNumber: { increment: 1 } },
      create: { name: "returnCounter", currentNumber: 1 },
    });

    const returnNo = `RET-${returnCounter.currentNumber.toString().padStart(4, "0")}`;

    const result = await prisma.$transaction(async (tx) => {
      const newReturn = await tx.return.create({
        data: {
          returnNo,
          returnType,
          customerId,
          supplierId,
          orderId,
          purchaseId,
          totalAmount,
          tax,
          grandTotal,
          reason,
          createdBy,
          items: {
            create: items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
              total: item.quantity * item.price,
            })),
          },
        },
      });

      for (const item of items) {
        // Handle sale returns (customer returns)
        if (customerId) {
          // find the original order item ei muhurte koyta return kora hoise
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

          // calculate total return quantity ja ekhon return korbo ebong previous return er quantity jog
          const totalTargetReturn =
            (originalOrderItem.returnedQty || 0) + item.quantity;

          if (totalTargetReturn > originalOrderItem.quantity) {
            throw new Error(
              `Cannot return more than the original quantity for product: ${originalOrderItem.product.name}`,
            );
          }

          await tx.product.update({
            where: { id: item.productId },
            data: {
              stock: {
                increment: item.quantity,
              },
            },
          });

          await tx.orderItem.update({
            where: { id: item.orderItemId },
            data: { returnedQty: { increment: item.quantity } },
          });
        }

        if (supplierId) {
          // Handle purchase returns (supplier returns)
          const originalPurchaseItem = await tx.purchaseItem.findUnique({
            where: { id: item.purchaseItemId },
            select: {
              quantity: true,
              returnedQty: true,
              product: { select: { name: true } },
            },
          });

          if (!originalPurchaseItem) {
            throw new Error(
              `Purchase item not found for ID: ${item.purchaseItemId}`,
            );
          }

          // calculate total return quantity ja ekhon return korbo ebong previous return er quantity jog
          const totalTargetReturn =
            (originalPurchaseItem.returnedQty || 0) + item.quantity;

          if (totalTargetReturn > originalPurchaseItem.quantity) {
            throw new Error(
              `Cannot return more than the original quantity for product: ${originalPurchaseItem.product.name}`,
            );
          }

          await tx.product.update({
            where: { id: item.productId },
            data: {
              stock: {
                decrement: item.quantity,
              },
            },
          });

          await tx.purchaseItem.update({
            where: { id: item.purchaseItemId },
            data: { returnedQty: { increment: item.quantity } },
          });
        }
      }

      if (
        returnType === "SALE" &&
        customerId &&
        customerId !== walkInCustomer?.id
      ) {
        await tx.customer.update({
          where: { id: customerId },
          data: {
            totalSpent: {
              decrement: grandTotal,
            },
          },
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

      if (returnType === "PURCHASE" && supplierId) {
        await tx.supplier.update({
          where: { id: supplierId },
          data: {
            totalSpent: { decrement: grandTotal },
          },
        });

        if (purchaseId) {
          await tx.purchase.update({
            where: { id: purchaseId },
            data: {
              total: { decrement: totalAmount },
            },
          });
        }
      }

      return newReturn;
    });

    res.status(201).json({
      success: true,
      data: result,
      message: "Return created successfully",
    });
  } catch (error) {
    console.error(error, "return error");
    res.status(400).json({
      success: false,
      message:
        error.message || "Something went wrong while processing the return",
    });
  }
};

export { createReturn };
