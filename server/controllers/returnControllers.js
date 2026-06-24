import prisma from '../lib/prisma.js';
import AppError from '../lib/utils/AppError.js';
import { handleSaleReturn } from '../lib/return_lib/handleSaleReturn.js';
import { handlePurchaseReturn } from '../lib/return_lib/handlePurchaseReturn.js';

const createReturn = async (req, res) => {
	try {
		const {
			orderId,
			customerId,
			purchaseId,
			supplierId,
			items,
			reason,
			tax = 0,
		} = req.body;
		const createdBy = req.user.id;

		const totalAmount = items.reduce(
			(total, item) => total + item.quantity * item.price,
			0,
		);
		const grandTotal = totalAmount + tax;
		const returnType = purchaseId ? 'PURCHASE' : 'SALE';

		const returnCounter = await prisma.returnCounter.upsert({
			where: { name: 'returnCounter' },
			update: { currentNumber: { increment: 1 } },
			create: { name: 'returnCounter', currentNumber: 1 },
		});
		const returnNo = `RET-${returnCounter.currentNumber.toString().padStart(4, '0')}`;

		const walkInCustomer = await prisma.customer.findUnique({
			where: { phone: '0000000000' },
		});

		if (!walkInCustomer) {
			throw new AppError('Walk-in customer not found', 500);
		}

		const result = await prisma.$transaction(async (tx) => {
			const newReturn = await tx.return.create({
				data: {
					returnNo,
					returnType,
					customerId,
					supplierId,
					orderId,
					purchaseId,
					totalAmount,
					tax,
					grandTotal,
					reason,
					createdBy,
					items: {
						create: items.map((item) => ({
							productId: item.productId,
							quantity: item.quantity,
							price: item.price,
							total: item.quantity * item.price,
						})),
					},
				},
			});

			if (returnType === 'SALE') {
				await handleSaleReturn(tx, {
					items,
					customerId,
					walkInCustomerId: walkInCustomer?.id,
					orderId,
					totalAmount,
					grandTotal,
				});
			} else {
				await handlePurchaseReturn(tx, {
					items,
					supplierId,
					purchaseId,
					totalAmount,
					grandTotal,
				});
			}

			return newReturn;
		});

		return res.status(201).json({
			success: true,
			data: result,
			message: 'Return created successfully',
		});
	} catch (error) {
		console.error('Return Error: ', error);
		return res.status(500).json({
			success: false,
			message: error.message || 'Internal server error',
		});
	}
};

export { createReturn };
