import z from "zod";

const productsSchema = z
  .object({
    // basic info
    name: z
      .string()
      .trim()
      .min(1, { message: "Name is required" })
      .max(50, { message: "Name must be at most 50 characters" }),
    description: z.string().trim().optional(),
    images: z
      .array(z.string().url({ message: "Each image must be a valid URL" }))
      .max(5, { message: "You can upload at most 5 images" })
      .optional(),
    barcode: z.string().trim().optional(),
    sku: z.string().trim().optional(),
    productType: z.enum(["SIMPLE", "VARIANT", "COMPOSITE"]).default("SIMPLE"),

    // categorization
    categoryId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid Category ID"),
    brandId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid Brand ID")
      .optional(),

    // pricing
    costPrice: z
      .number({
        required_error: "Cost price is required",
        invalid_type_error: "Cost price must be a number",
      })
      .positive({ message: "Cost price must be a positive number" }),
    basePrice: z
      .number({
        required_error: "Base price is required",
        invalid_type_error: "Base price must be a number",
      })
      .positive({ message: "Base price must be a positive number" }),
    discountType: z.enum(["NONE", "PERCENTAGE", "FIXED"]).default("NONE"),
    discountValue: z.number().min(0).default(0),

    // stock
    stock: z.number().default(0),
    lowStockAlert: z.number().default(5),
    unit: z
      .enum(["PCS", "KG", "GRAM", "LITRE", "DOZEN", "METER", "BOX"])
      .default("PCS"),

    // extra
    taxRate: z.number().default(0),
    isActive: z.boolean().default(true),
    tags: z
      .array(z.string().min(1, { message: "Tag cannot be empty" }))
      .optional()
      .default([]),
  })
  .refine(
    (data) => {
      if (data.discountType === "NONE" && data.discountValue > 0) {
        return false; // Error dibe
      }
      return true;
    },
    {
      message: "Cannot have a value without a discount type",
      path: ["discountValue"],
    },
  );

export default productsSchema;
