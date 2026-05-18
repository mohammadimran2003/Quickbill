import z from 'zod';

const supplierSchema = z.object({
	name: z.string().min(1, 'Name is required'),
	phone: z.string().min(1, 'Phone is required'),
	email: z.string().email().optional(),
	address: z.string().optional(),
	note: z.string().optional(),
	isActive: z.boolean().default(true),
});

export { supplierSchema };
