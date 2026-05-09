import prisma from '../lib/prisma.js';
import getDiscountAmount from '../lib/utils/getDiscountAmount.js';
import getPrice from '../lib/utils/getPrice.js';

const createOrder = async (req, res) => {
	try {
		const orderData = req.body;
		const { items, amountPaid, customerId, discountType, discountValue } =
			orderData;

		const productIds = items.map((item) => item.productId);
		const products = await prisma.product.findMany({
			where: { id: { in: productIds } },
			include: { priceTiers: true },
		});

		let subTotal = 0;
		let totalCostPrice = 0;
		let taxAmount = 0;
		let walletDeduction = 0;
		const orderItems = [];

		// stock check + price calculate
		for (const item of items) {
			const product = products.find((p) => p.id === item.productId);

			if (!product) {
				return res.status(404).json({
					success: false,
					message: `Product not found`,
				});
			}

			if (product.stock < item.quantity) {
				return res.status(400).json({
					success: false,
					message: `${product.name} er stock nai. Available: ${product.stock}`,
				});
			}

			const unitPrice = getPrice(
				product.priceTiers,
				product.basePrice,
				item.quantity,
			);

			const itemTotal = (unitPrice - (item.discount || 0)) * item.quantity;

			subTotal += itemTotal;
			totalCostPrice += product.costPrice * item.quantity;
			taxAmount += (product.taxRate / 100) * itemTotal;

			orderItems.push({
				productId: product.id,
				productName: product.name,
				unitPrice,
				purchasePrice: product.costPrice,
				quantity: item.quantity,
				discount: item.discount || 0,
				total: itemTotal,
			});
		}

		// order level discount
		const discountAmount = getDiscountAmount(
			discountType,
			discountValue,
			subTotal,
		);
		const total = subTotal - (discountAmount + taxAmount);

		// payment calculate
		let dueAmount = amountPaid < total ? total - amountPaid : 0;
		const changeAmount = amountPaid > total ? amountPaid - total : 0;

		// customer check
		if (customerId) {
			const customer = await prisma.customer.findUnique({
				where: { id: customerId },
			});

			if (!customer) {
				return res.status(404).json({
					success: false,
					message: 'Customer not found',
				});
			}

			if (customer.totalDue + dueAmount > customer.creditLimit) {
				return res.status(400).json({
					success: false,
					message: `Credit limit exceeded. Available credit: ${customer.creditLimit - customer.totalDue}tk`,
				});
			}

			if (customer.walletBalance > 0 && dueAmount > 0) {
				walletDeduction = Math.min(customer.walletBalance, dueAmount);
				dueAmount = dueAmount - walletDeduction;
			}
		}

		const result = await prisma.$transaction(async (tx) => {
			// invoice number generate
			const lastOrder = await tx.order.findFirst({
				orderBy: { createdAt: 'desc' },
			});

			const counter = await tx.counter.upsert({
				where: { name: 'order' },
				update: { value: { increment: 1 } },
				create: { name: 'order', value: 6 },
			});

			const orderNumber = `INV-${String(counter.value).padStart(4, '0')}`;

			const status =
				dueAmount > 0 ?
					amountPaid > 0 ?
						'PARTIAL'
					:	'PENDING'
				:	'COMPLETED';

			// order create
			const order = await tx.order.create({
				data: {
					orderNumber,
					customerId: customerId || null,
					subtotal: subTotal,
					discountType: discountType || null,
					discountValue: discountValue || 0,
					discountAmount,
					taxAmount,
					total,
					totalCostPrice,
					paymentMethod: orderData.paymentMethod,
					amountPaid,
					changeAmount,
					dueAmount,
					orderType: orderData.orderType,
					note: orderData.note || null,
					status,
					createdBy: req.user.id,
					items: { create: orderItems },
				},
			});

			const stockUpdates = items.map((item) =>
				tx.product.update({
					where: { id: item.productId },
					data: { stock: { decrement: item.quantity } },
				}),
			);
			await Promise.all(stockUpdates);

			if (customerId) {
				await tx.customer.update({
					where: { id: customerId },
					data: {
						totalDue: { increment: dueAmount },
						walletBalance: { decrement: walletDeduction },
					},
				});

				await tx.walletTransaction.create({
					data: {
						type: 'PAYMENT',
						customerId,
						amount: total,
						createdBy: req.user.id,
					},
				});
			}

			return order;
		});

		res.status(201).json({
			success: true,
			message: 'Order created successfully',
			data: result,
		});
	} catch (err) {
		console.log(err, 'create order err');
		res.status(500).json({ success: false, message: 'Internal server error' });
	}
};

const getOrders = async (req, res) => {
	try {
		const orders = await prisma.order.findMany({
			orderBy: {
				createdAt: 'desc',
			},
		});

		res.status(200).json({
			success: true,
			message: 'Orders retrieved successfully',
			count: orders.length,
			data: orders,
		});
	} catch (err) {
		console.log(err, 'order get error');
		res.status(500).json({ success: false, message: 'Server internal error!' });
	}
};

const getOrder = async (req, res) => {
	try {
		const id = req.params.id;
		const order = await prisma.order.findUnique({
			where: { id },
			include: { items: true },
		});

		if (!order) {
			return res.status(404).json({
				success: false,
				message: 'Order not found',
			});
		}

		return res.status(200).json({
			success: true,
			message: 'Order retrieved successfully',
			data: order,
		});
	} catch (err) {
		console.log(err, 'get order err');
		res.status(500).json({ success: false, message: 'Internal server error' });
	}
};

const getLast30DaysOrders = async (req, res) => {
	try {
		const thirtyDaysAgo = new Date();
		thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

		// 1. Database theke data ana
		const orders = await prisma.order.groupBy({
			by: ['createdAt'],
			where: {
				createdAt: { gte: thirtyDaysAgo },
			},
			_sum: { total: true },
		});

		// 2. Proti diner sales-ke ekta object-e map kora (Easy lookup jonno)
		const salesMap = {};
		orders.forEach((order) => {
			const dateStr = new Date(order.createdAt).toISOString().split('T')[0];
			salesMap[dateStr] = (salesMap[dateStr] || 0) + (order._sum.total || 0);
		});

		// 3. Last 30 diner faka array toiri kora ebong data fill kora
		const finalData = [];
		for (let i = 29; i >= 0; i--) {
			const date = new Date();
			date.setDate(date.getDate() - i);
			const dateStr = date.toISOString().split('T')[0];

			finalData.push({
				date: dateStr,
				sales: salesMap[dateStr] || 0, // Sales na thakle 0 boshabe
			});
		}

		res.status(200).json({
			success: true,
			data: finalData,
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({ success: false, message: 'Internal server error' });
	}
};

const getRecentOrders = async (req, res) => {
	try {
		const recentOrders = await prisma.order.findMany({
			orderBy: {
				createdAt: 'desc',
			},
			include: {
				customer: {
					select: {
						name: true,
					},
				},
				_count: {
					select: { items: true },
				},
			},
			take: 5,
		});

		res.status(200).json({
			success: true,
			data: recentOrders,
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({ success: false, message: 'Internal server error' });
	}
};

export {
	createOrder,
	getOrders,
	getOrder,
	getLast30DaysOrders,
	getRecentOrders,
};
