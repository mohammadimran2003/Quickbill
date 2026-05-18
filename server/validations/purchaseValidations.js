import { z } from 'zod';

const purchaseSchema = z.object({
	supplierId: z.string().min(1, 'Supplier ID is required'),
	items: z
		.array(
			z.object({
				productId: z.string().min(1, 'Product ID is required'),
				quantity: z.number().min(1, 'Quantity is required'),
				unitCost: z.number().min(1, 'Unit Cost is required'),
			}),
		)
		.min(1, 'Items are required'),
	note: z.string().optional(),
});

export default purchaseSchema;
