import z from "zod";

const createUserSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters"),
  email: z.string().trim().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z
    .string()
    .min(6, "Confirm password must be at least 6 characters"),
  role: z.enum(["ADMIN", "SALESMAN", "MANAGER"], {
    required_error: "Role is required",
  }),
  isActive: z.boolean().default(true),
  phone: z
    .string()
    .regex(
      /^(?:\+88)?01[1-9]\d{8}$/,
      "Must be a valid Bangladeshi phone number (e.g., 01712345678 or +8801712345678)",
    )
    .optional()
    .or(z.literal("")),
  address: z.string().trim().optional(),
  photo: z.string().trim().optional(),
});

export { createUserSchema };
