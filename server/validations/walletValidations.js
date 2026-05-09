import { z } from 'zod';

// ১. Enum define kora (Prisma-r motoi)
const WalletTransactionType = z.enum(['CREDIT', 'DEBIT', 'PAYMENT', 'REFUND']);
// Tomar actual enum values gulo ekhane bosiye nio

export const walletTransactionSchema = z.object({
	// ObjectId gulo sadharonoto 24 character-er string hoy
	customerId: z.string().length(24, 'Invalid Customer ID'),

	type: WalletTransactionType,

	// Amount gulo shob somoy positive hote hobe
	amount: z.number().positive('Amount oboshoy 0 er beshi hote hobe'),

	// Due deduction o wallet credit optional thakle default 0
	dueDeduction: z
		.number()
		.nonnegative('Due deduction negative hote parbe na')
		.default(0),

	walletCredit: z
		.number()
		.nonnegative('Wallet credit negative hote parbe na')
		.default(0),

	// Note optional, kintu thakle amra string length limit kore dite pari
	note: z
		.string()
		.max(255, 'Note khub beshi boro hoye geche')
		.nullable()
		.optional(),

	createdBy: z.string().length(24, 'Invalid User ID'),
});

export default walletTransactionSchema;
