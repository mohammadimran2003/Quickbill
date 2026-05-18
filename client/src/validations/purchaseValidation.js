import z from 'zod';

export const purchaseItemSchema = z.object({
	productId: z.string().min(1, 'Product is required'),
	productName: z.string().min(1, 'Product name is required'),
	quantity: z.number().min(1, 'Quantity must be at least 1'),
	unitCost: z.number().min(0, 'Unit cost cannot be negative'),
	total: z.number().min(0, 'Total cannot be negative'),
});

export const purchaseSchema = z.object({
	supplierId: z.string().optional().nullable(),
	items: z.array(purchaseItemSchema).min(1, 'At least one item is required'),
	subTotal: z.number().min(0, 'Subtotal cannot be negative'),
	total: z.number().min(0, 'Total cannot be negative'),
	paidAmount: z.number().min(0, 'Paid amount cannot be negative'),
	dueAmount: z.number().min(0, 'Due amount cannot be negative'),
	status: z.enum(['ORDERED', 'RECEIVED', 'CANCELLED']),
	note: z.string().optional().nullable(),
	paymentMethod: z.enum(['CASH', 'CARD', 'MOBILE_BANKING', 'UNPAID']),
});
