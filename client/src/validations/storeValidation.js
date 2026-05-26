import z from "zod";

export const createStoreSchema = z.object({
  name: z.string().min(1, "Name is required"),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  logo: z.string().optional(),
  receiptFooter: z.string().optional(),
  currency: z.string().default("৳"),
  taxRate: z.coerce.number().default(0),
  binNumber: z.string().optional(),
  invoicePrefix: z.string().default("INV-"),
  timeZone: z.string().default("Asia/Dhaka"),
});
