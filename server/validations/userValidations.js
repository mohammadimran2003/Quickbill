import z from "zod";

export const userSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z
    .string()
    .min(6, "Confirm password must be at least 6 characters")
    .optional(),
  role: z.enum(
    ["ADMIN", "SALESMAN", "MANAGER"],
    "Role must be ADMIN, SALESMAN or MANAGER",
  ),
  isActive: z.boolean().default(true),
  phone: z
    .string()
    .regex(
      /^(?:\+88)?01[1-9]\d{8}$/,
      "Must be a valid Bangladeshi phone number (e.g., 01712345678 or +8801712345678)",
    )
    .optional(),

  address: z.string().optional(),
  photo: z.string().optional(),
});
