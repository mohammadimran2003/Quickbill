import calculateReturnMetrics from '../lib/calculateReturnMetrics.js';
import prisma from '../lib/prisma.js';
import AppError from '../lib/utils/AppError.js';
import getDiscountAmount from '../lib/utils/getDiscountAmount.js';
import getPrice from '../lib/utils/getPrice.js';

const createOrder = async (req, res) => {
	const orderData = req.body;
	const {
		items,
		amountPaid,
		customerId,
		discountType,
		discountValue,
		draftId,
	} = orderData;

	if (!items || items.length === 0) {
		return res.status(400).json({
			success: false,
			message: 'No items in the order',
		});
	}

	const productIds = items.map((item) => item.productId);

	const products = await prisma.product.findMany({
		where: { id: { in: productIds } },
		include: { priceTiers: true },
	});

	let setCustomerId = customerId;
	let subTotal = 0;
	let totalCostPrice = 0;
	let taxAmount = 0;
	let walletDeduction = 0;
	const orderItems = [];
	let customerName = 'Walk-in customer';

	// stock check + price calculate
	for (const item of items) {
		const product = products.find((p) => p.id === item.productId);

		if (!product) {
			throw new AppError('Product not found', 404);
		}

		if (product.stock < item.quantity) {
			throw new AppError(
				`Out of stock for ${product.name}. Available: ${product.stock}`,
				400,
			);
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
			throw new AppError('Customer not found', 404);
		}

		customerName = customer.name;

		if (customer.totalDue + dueAmount > customer.creditLimit) {
			throw new AppError(
				`Credit limit exceeded. Available credit: ${customer.creditLimit - customer.totalDue}tk`,
				400,
			);
		}

		if (customer.walletBalance > 0 && dueAmount > 0) {
			walletDeduction = Math.min(customer.walletBalance, dueAmount);
			dueAmount = dueAmount - walletDeduction;
		}
	}

	if (!customerId) {
		const walkIn = await prisma.customer.findUnique({
			where: { phone: '0000000000' },
		});

		if (!walkIn) {
			throw new AppError('Walk-in customer not found', 500);
		}

		setCustomerId = walkIn.id;
	}

	const result = await prisma.$transaction(async (tx) => {
		// invoice number generate
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

		const orderDate = new Date();
		orderDate.setHours(0, 0, 0, 0);
		const monthLabel = orderDate.toLocaleString('en-US', { month: 'short' });
		const currentYear = orderDate.getFullYear();

		// order create
		const order = await tx.order.create({
			data: {
				orderNumber,
				customerId: setCustomerId,
				customerName,
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
				date: orderDate,
				month: monthLabel,
				year: currentYear,
			},
			include: {
				items: true,
			},
		});

		if (draftId) {
			const draftDelete = await tx.draftOrder.delete({
				where: { id: draftId },
			});

			console.log('Draft deleted:', draftDelete);
		}

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
					totalSpent: { increment: total },
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
};

const getOrders = async (req, res) => {
	const { name, invoice, status, page = 1, limit = 10 } = req.query;
	const skip = (page - 1) * limit;

	const where = {
		...(invoice ?
			{ orderNumber: { contains: invoice, mode: 'insensitive' } }
		:	{}),
		...(name ? { customerName: { contains: name, mode: 'insensitive' } } : {}),
		...(status ? { status: status } : {}),
	};

	const [orders, totalOrders] = await Promise.all([
		prisma.order.findMany({
			where,
			orderBy: {
				createdAt: 'desc',
			},
			skip: Number(skip),
			take: Number(limit),
			include: {
				items: true,
				customer: true,
			},
		}),
		prisma.order.count({ where }),
	]);

	res.status(200).json({
		success: true,
		message: 'Orders retrieved successfully',
		count: totalOrders,
		currentPage: page,
		data: orders,
	});
};

const getOrder = async (req, res) => {
	const { id } = req.params;

	// 1. order tar item and return gulo load kora holo
	const order = await prisma.order.findUnique({
		where: { id },
		include: {
			items: true,
			returns: {
				include: { items: true },
			},
		},
	});

	if (!order) {
		throw new AppError('Order not found', 404);
	}
	console.log(order, 'order');

	const itemsWithReturnValidation = calculateReturnMetrics(order);

	const { returns, ...cleanOrderData } = order;
	cleanOrderData.items = itemsWithReturnValidation;

	res.status(200).json({ success: true, data: cleanOrderData });
};

const getLast30DaysOrders = async (req, res) => {
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
};

const getRecentOrders = async (req, res) => {
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
};

export {
	createOrder,
	getOrders,
	getOrder,
	getLast30DaysOrders,
	getRecentOrders,
};
