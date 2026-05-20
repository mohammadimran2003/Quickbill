import groupOrders from '../lib/utils/groupOrders.js';
import prisma from '../lib/prisma.js';

const getSalesReport = async (req, res) => {
	const { from, to, groupBy = 'daily' } = req.query;

	const startDate = new Date(from);
	const endDate = new Date(to);
	endDate.setHours(23, 59, 59, 999);

	const where = {
		status: 'COMPLETED',
		createdAt: { gte: startDate, lte: endDate },
	};

	// Summary — group by te changte hoy na
	const summary = await prisma.order.aggregate({
		where,
		_sum: { total: true, totalCostPrice: true },
		_count: true,
	});

	// Chart data — group by onujayi
	const orders = await prisma.order.findMany({
		where,
		select: {
			total: true,
			totalCostPrice: true,
			createdAt: true,
			paymentMethod: true,
			amountPaid: true,
		},
		orderBy: { createdAt: 'asc' },
	});

	// top selling products
	const topProductsGrouped = await prisma.orderItem.groupBy({
		by: ['productId', 'productName'],
		where: { createdAt: { gte: startDate, lte: endDate } },
		_sum: { quantity: true },
		orderBy: { _sum: { quantity: 'desc' } },
		take: 5,
	});

	// top productIds
	const productIds = topProductsGrouped.map((item) => item.productId);

	// Fetch all order items for these top products within the date range to calculate revenue & profit
	const topProductsItems = await prisma.orderItem.findMany({
		where: {
			productId: { in: productIds },
			createdAt: { gte: startDate, lte: endDate },
		},
		select: {
			productId: true,
			productName: true,
			quantity: true,
			purchasePrice: true,
			total: true,
		},
	});

	const finalProductsReport = productIds.map((pId) => {
		const items = topProductsItems.filter((item) => item.productId === pId);

		const quantity = items.reduce((sum, item) => sum + item.quantity, 0);
		const revenue = items.reduce((sum, item) => sum + item.total, 0);
		const cost = items.reduce(
			(sum, item) => sum + item.purchasePrice * item.quantity,
			0,
		);
		const profit = revenue - cost;

		return {
			productId: pId,
			name: topProductsGrouped[0].productName || 'Unknown Product',
			quantity,
			revenue,
			profit,
		};
	});

	// top customers
	const topCustomersGrouped = await prisma.order.groupBy({
		by: ['customerId'],
		where: { createdAt: { gte: startDate, lte: endDate } },
		_sum: { total: true },
		_count: { id: true },
		orderBy: { _sum: { total: 'desc' } },
		take: 5,
	});

	const customerIds = topCustomersGrouped
		.map((item) => item.customerId)
		.filter(Boolean);

	const customerDetails = await prisma.customer.findMany({
		where: { id: { in: customerIds } },
		select: { id: true, name: true, phone: true },
	});

	const finalCustomersReport = topCustomersGrouped.map((groupItem) => {
		const details = customerDetails.find(
			(c) => String(c.id) === String(groupItem.customerId),
		);
		return {
			customerId: groupItem.customerId,
			name:
				details?.name ||
				(groupItem.customerId ? 'Unknown Customer' : 'Walk-in Customer'),
			phone: details?.phone || 'N/A',
			orders: groupItem._count.id,
			totalSpent: groupItem._sum.total || 0,
		};
	});

	// Group kora hoise
	const chartData = groupOrders(orders, groupBy);

	res.status(200).json({
		success: true,
		data: {
			summary: {
				totalRevenue: summary._sum.total || 0,
				totalOrders: summary._count || 0,
				totalProfit:
					(summary._sum.total || 0) - (summary._sum.totalCostPrice || 0),
				avgOrderValue:
					summary._count ? (summary._sum.total || 0) / summary._count : 0,
			},
			chartData,
			products: finalProductsReport,
			customers: finalCustomersReport,
		},
	});
};

const getProfitReport = async (req, res) => {
	try {
		const { from, to, groupBy = 'daily' } = req.query;

		const startDate = new Date(from);
		const endDate = new Date(to);
		endDate.setHours(23, 59, 59, 999);

		const where = {
			status: 'COMPLETED',
			createdAt: { gte: startDate, lte: endDate },
		};

		// summary
		const summary = await prisma.order.aggregate({
			where,
			_sum: { total: true, totalCostPrice: true },
			_count: true,
		});

		// Fetch orders for charting
		const orders = await prisma.order.findMany({
			where,
			select: {
				total: true,
				totalCostPrice: true,
				createdAt: true,
				paymentMethod: true,
				amountPaid: true,
			},
			orderBy: { createdAt: 'asc' },
		});

		const chartData = groupOrders(orders, groupBy);

		// Top profitable products — group by productId, calculate profit
		// Top profitable products — group by productId, calculate profit
		const profitableGrouped = await prisma.orderItem.groupBy({
			by: ['productId', 'productName'],
			where: {
				order: { status: 'COMPLETED' },
				createdAt: { gte: startDate, lte: endDate },
			},
			_sum: {
				quantity: true,
				total: true,
			},
			_avg: {
				purchasePrice: true,
			},
		});

		const profitableProducts = profitableGrouped
			.map((item) => {
				const quantitySold = item._sum.quantity || 0;
				const totalRevenue = item._sum.total || 0;

				// 💡	avg damer sathe total quantity gun kore total cost ber kora hoyeche

				const avgPurchasePrice = item._avg.purchasePrice || 0;
				const totalCost = avgPurchasePrice * quantitySold;

				const netProfit = totalRevenue - totalCost;
				const profitMargin =
					totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

				return {
					productId: item.productId,
					name: item.productName || 'Unknown Product',
					quantitySold,
					totalRevenue,
					totalCost,
					netProfit,

					profitMargin: Number(profitMargin.toFixed(2)),
				};
			})
			.sort((a, b) => b.netProfit - a.netProfit)
			.slice(0, 10);

		// Profit by Category — fetch order items with product→category relation
		const categoryItems = await prisma.orderItem.findMany({
			where: {
				order: { status: 'COMPLETED' },
				createdAt: { gte: startDate, lte: endDate },
			},
			select: {
				quantity: true,
				total: true,
				purchasePrice: true,
				product: {
					select: {
						category: { select: { id: true, name: true } },
					},
				},
			},
		});

		// Reduce by category in JS
		const categoryMap = {};

		for (const item of categoryItems) {
			const cat = item.product?.category;
			if (!cat) continue;

			const key = cat.id;
			if (!categoryMap[key]) {
				categoryMap[key] = {
					categoryId: cat.id,
					categoryName: cat.name,
					totalRevenue: 0,
					totalCost: 0,
				};
			}

			const itemRevenue = item.total || 0;
			const itemCost = (item.purchasePrice || 0) * item.quantity;

			categoryMap[key].totalRevenue += itemRevenue;
			categoryMap[key].totalCost += itemCost;
		}

		console.log(Object.values(categoryMap), 'mapsss');
		console.log(categoryMap, 'cat map');

		const profitByCategory = Object.values(categoryMap)
			.map((cat) => {
				const totalRevenue = Number(cat.totalRevenue.toFixed(2));
				const totalCost = Number(cat.totalCost.toFixed(2));
				const netProfit = Number((totalRevenue - totalCost).toFixed(2));

				const profitMargin =
					totalRevenue > 0 ?
						Number(((netProfit / totalRevenue) * 100).toFixed(2))
					:	0;

				return {
					categoryId: cat.categoryId,
					categoryName: cat.categoryName,
					totalRevenue,
					totalCost,
					netProfit,
					profitMargin,
				};
			})
			.sort((a, b) => b.netProfit - a.netProfit)
			.slice(0, 5);

		// response return
		return res.status(200).json({
			success: true,
			data: {
				summary: {
					totalRevenue: summary._sum.total || 0,
					totalOrders: summary._count || 0,
					totalProfit: Number(
						(
							(summary._sum.total || 0) - (summary._sum.totalCostPrice || 0)
						).toFixed(2),
					),
					totalCostPrice: summary._sum.totalCostPrice || 0,
				},
				chartData,
				profitableProducts,
				profitByCategory,
			},
		});
	} catch (err) {
		console.log(err);
		return res.status(500).json({
			success: false,
			message: 'Internal server error',
		});
	}
};

export { getSalesReport, getProfitReport };
