import z from 'zod';

const orderItemSchema = z.object({
	productId: z
		.string({
			required_error: 'Product is required',
			invalid_type_error: 'Product id must be a string',
		})
		.trim(),
	quantity: z
		.number({
			required_error: 'Quantity is required',
			invalid_type_error: 'Quantity must be a number',
		})
		.int()
		.positive({ message: 'Quantity must be a positive number' }),
	discount: z.number().default(0), // item level discount
});

const orderSchema = z
	.object({
		customerId: z.string().optional(),

		items: z
			.array(orderItemSchema, {
				required_error: 'Items are required',
			})
			.min(1, { message: 'At least one item is required' }),

		discountType: z.enum(['FLAT', 'PERCENTAGE', 'NONE']).default('NONE'),
		discountValue: z.number().default(0),

		amountPaid: z
			.number({
				required_error: 'Amount paid is required',
				invalid_type_error: 'Amount paid must be a number',
			})
			.nonnegative('Amount paid cannot be negative'),

		paymentMethod: z
			.enum(['CASH', 'CARD', 'MOBILE_BANKING', 'UNPAID'])
			.default('CASH'),

		orderType: z.enum(['WALK_IN', 'DELIVERY']).default('WALK_IN'),
		note: z.string().trim().optional(),
	})
	.refine(
		(data) => {
			if (data.amountPaid === 0 && data.paymentMethod !== 'UNPAID') {
				return false;
			}
			// Logic error protection: Taka dile jeno UNPAID na thake
			if (data.amountPaid > 0 && data.paymentMethod === 'UNPAID') {
				return false;
			}
			return true;
		},
		{
			message:
				"Amount paid 0 hole method 'UNPAID' hote hobe, ar taka dile 'UNPAID' kora jabe na",
			path: ['paymentMethod'],
		},
	);

export default orderSchema;
