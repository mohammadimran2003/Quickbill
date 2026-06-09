import { z } from "zod";

const purchaseSchema = z.object({
  supplierId: z.string().min(1, "Supplier ID is required"),
  items: z
    .array(
      z.object({
        productId: z.string().min(1, "Product ID is required"),
        quantity: z.number().min(1, "Quantity is required"),
        unitCost: z.number().min(1, "Unit Cost is required"),
        productName: z.string().min(1, "Product Name is required"),
      }),
    )
    .min(1, "Items are required"),
  note: z.string().optional(),
  paidAmount: z.number().min(0, "Paid amount cannot be negative"),
  paymentMethod: z.enum(["CASH", "CARD", "MOBILE_BANKING", "UNPAID"]),
});

export default purchaseSchema;
