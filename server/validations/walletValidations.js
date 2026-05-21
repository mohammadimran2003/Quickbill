import { z } from 'zod';

// ১. Enum define kora (Prisma-r motoi)
const WalletTransactionType = z.enum(['RECHARGE', 'PAYMENT', 'DUE_PAYMENT']);
// Tomar actual enum values gulo ekhane bosiye nio

export const walletRechargeSchema = z.object({
	amount: z
		.number({
			required_error: 'Amount is required',
			invalid_type_error: 'Amount must be a number',
		})
		.positive('Amount must be greater than 0'),
	note: z.string().max(255).optional(),
});

export const walletTransactionSchema = z.object({
	// ObjectId gulo sadharonoto 24 character-er string hoy
	customerId: z.string().length(24, 'Invalid Customer ID'),

	type: WalletTransactionType.default('RECHARGE').optional(),

	// Amount gulo shob somoy positive hote hobe
	amount: z.number().positive('Amount oboshoy 0 er beshi hote hobe'),

	// Due deduction o wallet credit optional thakle default 0
	dueDeduction: z
		.number()
		.nonnegative('Due deduction negative hote parbe na')
		.default(0)
		.optional(),

	walletCredit: z
		.number()
		.nonnegative('Wallet credit negative hote parbe na')
		.default(0)
		.optional(),

	// Note optional, kintu thakle amra string length limit korlam
	note: z
		.string()
		.max(255, 'Note khub beshi boro hoye geche')
		.nullable()
		.optional(),

	createdBy: z.string().length(24, 'Invalid User ID').optional(),
});
