import z from "zod";

const createExpenseCategorySchema = z.object({
  name: z.string().min(1, "Name is required"),
});

const createExpenseSchema = z.object({
  title: z.string().min(1, "Title is required"),
  amount: z.coerce
    .number({ invalid_type_error: "Amount is required" })
    .positive("Amount must be greater than 0"),
  categoryId: z.string().min(1, "Category ID is required"),
  paymentMethod: z.enum(["CASH", "MOBILE_BANKING", "BANK_TRANSFER", "OTHER"]),
  note: z.string().optional(),
  referenceId: z.string().optional(),
  date: z.coerce.string().optional(),
});

export { createExpenseCategorySchema, createExpenseSchema };
