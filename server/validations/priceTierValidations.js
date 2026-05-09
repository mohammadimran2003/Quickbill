import z from 'zod';

const priceTierSchema = z.object({
	name: z.enum(['RETAIL', 'WHOLESALE', 'VIP', 'SPECIAL'], {
		required_error: 'Tier name is required',
		invalid_type_error: 'Tier name must be RETAIL, WHOLESALE, VIP or SPECIAL',
	}),
	minQty: z
		.number({
			invalid_type_error: 'minQty must be a number',
			required_error: 'minQty is required',
		})
		.int({ message: 'minQty must be a whole number' })
		.positive({ message: 'minQty must be a positive number' }),
	price: z
		.number({
			invalid_type_error: 'Price must be a number',
			required_error: 'Price is required',
		})
		.positive({ message: 'Price must be a positive number' }),
});

export default priceTierSchema;
