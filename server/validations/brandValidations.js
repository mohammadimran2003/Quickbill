import z from 'zod';

const createBrandSchema = z.object({
	name: z
		.string()
		.trim()
		.min(2, 'min 2 charachter required')
		.max(20, 'max 20 charachter is required'),
	description: z.string().trim().optional(),
	image: z.string().trim().optional(),
	isActive: z.boolean().default(true),
});

export { createBrandSchema };
