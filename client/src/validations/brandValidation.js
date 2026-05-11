import z from 'zod';

const createBrandSchema = z.object({
	name: z
		.string()
		.trim()
		.min(2, 'min 2 characters required')
		.max(20, 'max 20 characters is required'),
	description: z.string().trim().optional(),
	logo: z.string().trim().optional(),
	isActive: z.boolean().default(true),
});

export { createBrandSchema };
