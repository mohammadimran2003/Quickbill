import z from 'zod';

const bdPhoneRegex = /^(?:\+88|88)?(01[3-9]\d{8})$/;

const customerSchema = z.object({
	name: z
		.string()
		.trim()
		.min(1, 'Name is required')
		.max(50, 'Name must be at most 50 characters'),
	phone: z
		.string()
		.trim()
		.regex(
			bdPhoneRegex,
			'Invalid Bangladeshi phone number (e.g., 017xxxxxxxx)',
		),

	email: z
		.string()
		.trim()
		.email('Invalid email address')
		.optional()
		.or(z.literal('')),

	address: z.string().trim().max(200, 'Address is too long').optional(),

	customerType: z.enum(['REGULAR', 'WHOLESALE']).default('REGULAR'),

	creditLimit: z.number().min(0).default(0),

	note: z.string().trim().max(500, 'Note is too long').optional(),
});

export { customerSchema };
