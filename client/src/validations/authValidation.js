// client/src/validations/authValidation.js
// import { z } from "zod";

// export const registerSchema = z.object({
//   name: z.string().min(1, { message: "Name is required" }),
//   email: z.string().email({ message: "Valid email required" }),
//   password: z.string().min(6, { message: "Min 6 characters" }),
//   role: z.enum(["ADMIN", "MANAGER", "SALESMAN"]),
// });

import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email({ message: "Valid email required" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

const baseUserSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters"),
  email: z.string().trim().email("Invalid email address"),
  role: z.enum(["ADMIN", "SALESMAN", "MANAGER"], {
    required_error: "Role is required",
  }),
  isActive: z.boolean().default(true),
  phone: z
    .string()
    .regex(
      /^(?:\+88)?01[1-9]\d{8}$/,
      "Must be a valid Bangladeshi phone number (e.g., 01712345678)",
    )
    .optional()
    .or(z.literal("")),
  address: z.string().trim().optional().or(z.literal("")),
  photo: z.string().trim().optional().or(z.literal("")),
});

const registerSchema = baseUserSchema
  .extend({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Confirm password must be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const updateUserSchema = baseUserSchema.partial();

export { registerSchema, updateUserSchema, loginSchema };
