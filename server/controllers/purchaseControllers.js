import prisma from '../lib/prisma.js';

const createPurchase = async (req, res) => {
	try {
		const {
			supplierId,
			items,
			note,
			paidAmount,
			paymentMethod = 'CASH',
		} = req.body;
		const createdBy = req.user.id;
		console.log(req.body, 'req.boy puchae');

		const productIds = items.map((item) => item.productId);

		const products = await prisma.product.findMany({
			where: { id: { in: productIds } },
		});

		if (products.length !== items.length) {
			return res
				.status(404)
				.json({ success: false, message: 'Product not found' });
		}

		let subTotal = 0;
		let totalAmount = 0;
		let walletDeduction = 0;

		for (let item of items) {
			subTotal += item.unitCost * item.quantity;
		}

		totalAmount = subTotal;
		let dueAmount = totalAmount > paidAmount ? totalAmount - paidAmount : 0;

		const purchaseCoutner = await prisma.purchaseCounter.upsert({
			where: { name: 'PURCHASE_COUNTER' },
			update: { value: { increment: 1 } },
			create: { name: 'PURCHASE_COUNTER', value: 1 },
		});

		const purchaseNumber = `PUR-${String(purchaseCoutner.value).padStart(
			4,
			'0',
		)}`;

		if (supplierId) {
			const supplier = await prisma.supplier.findUnique({
				where: { id: supplierId },
			});

			if (supplier.walletBalance > 0 && dueAmount > 0) {
				walletDeduction = Math.min(supplier.walletBalance, dueAmount);
				dueAmount = dueAmount - walletDeduction;
			}
		}

		const result = await prisma.$transaction(async (tx) => {
			// update product stock
			for (let item of items) {
				await tx.product.update({
					where: { id: item.productId },
					data: { stock: { increment: item.quantity } },
				});
			}

			await tx.supplier.update({
				where: { id: supplierId },
				data: {
					walletBalance: { decrement: walletDeduction },
					totalDue: { increment: dueAmount },
					totalSpent: { increment: totalAmount },
				},
			});

			// create purchase
			const purchase = await tx.purchase.create({
				data: {
					supplierId,
					subTotal,
					total: totalAmount,
					note,
					createdBy,
					dueAmount,
					purchaseNumber,
					paymentMethod,
					items: {
						create: items.map((item) => ({
							...item,
							total: item.unitCost * item.quantity,
						})),
					},
				},
			});

			return purchase;
		});

		res.status(201).json({
			success: true,
			message: 'Purchase created successfully',
			data: result,
		});
	} catch (err) {
		console.log(err, 'create purchase err');
		res.status(500).json({ success: false, message: 'Internal Server Error' });
	}
};

const getPurchases = async (req, res) => {
	try {
		const purchases = await prisma.purchase.findMany({
			include: {
				supplier: true,
			},
		});
		res.status(200).json({
			success: true,
			message: 'Purchases retrieved successfully',
			data: purchases,
		});
	} catch (err) {
		console.log(err, 'get purchases err');
		res.status(500).json({ success: false, message: 'Internal Server Error' });
	}
};

const getPurchaseById = async (req, res) => {
	try {
		const { id } = req.params;
		const purchase = await prisma.purchase.findUnique({
			where: { id },
		});
		res.status(200).json({
			success: true,
			message: 'Purchase retrieved successfully',
			data: purchase,
		});
	} catch (err) {
		console.log(err, 'get purchase err');
		res.status(500).json({ success: false, message: 'Internal Server Error' });
	}
};

const updatePurchase = async (req, res) => {
	try {
		const { id } = req.params;
		const {
			supplierId,
			items,
			subTotal,
			taxAmount,
			discountAmount,
			totalAmount,
			note,
		} = req.body;
		const purchase = await prisma.purchase.update({
			where: { id },
			data: {
				supplierId,
				items,
				subTotal,
				taxAmount,
				discountAmount,
				totalAmount,
				note,
			},
		});
		res.status(200).json({
			success: true,
			message: 'Purchase updated successfully',
			data: purchase,
		});
	} catch (err) {
		console.log(err, 'update purchase err');
		res.status(500).json({ success: false, message: 'Internal Server Error' });
	}
};

const deletePurchase = async (req, res) => {
	try {
		const { id } = req.params;
		await prisma.purchase.delete({
			where: { id },
		});
		res.status(200).json({
			success: true,
			message: 'Purchase deleted successfully',
		});
	} catch (err) {
		console.log(err, 'delete purchase err');
		res.status(500).json({ success: false, message: 'Internal Server Error' });
	}
};

export {
	createPurchase,
	getPurchases,
	getPurchaseById,
	updatePurchase,
	deletePurchase,
};
