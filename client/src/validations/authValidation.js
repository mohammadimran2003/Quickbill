// client/src/validations/authValidation.js
import { z } from 'zod';

export const registerSchema = z.object({
	name: z.string().min(1, { message: 'Name is required' }),
	email: z.string().email({ message: 'Valid email required' }),
	password: z.string().min(6, { message: 'Min 6 characters' }),
	role: z.enum(['ADMIN', 'MANAGER', 'SALESMAN']),
});

export const loginSchema = z.object({
	email: z.string().email({ message: 'Valid email required' }),
	password: z
		.string()
		.min(6, { message: 'Password must be at least 6 characters' }),
});
