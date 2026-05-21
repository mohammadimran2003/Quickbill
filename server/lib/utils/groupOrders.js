const groupOrders = (orders, groupBy) => {
	const groups = {};
	orders.forEach((order) => {
		let key;
		const date = new Date(order.createdAt);

		if (groupBy === 'daily') {
			key = date.toISOString().slice(0, 10);
		} else if (groupBy === 'weekly') {
			const day = date.getDay();
			const diff = date.getDate() - day;
			const weekStart = new Date(date.setDate(diff));
			key = weekStart.toISOString().slice(0, 10);
		} else if (groupBy === 'monthly') {
			key = date.toISOString().slice(0, 7);
		}

		if (!groups[key]) {
			groups[key] = {
				date: key,
				revenue: 0,
				profit: 0,
				orders: 0,
				paymentBreakdown: {
					CASH: 0,
					CARD: 0,
					MOBILE_BANKING: 0,
				},
			};
		}

		groups[key].revenue += order.total;
		groups[key].profit += order.total - order.totalCostPrice;
		groups[key].orders += 1;

		// Update payment breakdown
		if (order.paymentMethod === 'CASH') {
			groups[key].paymentBreakdown.CASH += order.amountPaid;
		} else if (order.paymentMethod === 'CARD') {
			groups[key].paymentBreakdown.CARD += order.amountPaid;
		} else if (order.paymentMethod === 'MOBILE_BANKING') {
			groups[key].paymentBreakdown.MOBILE_BANKING += order.amountPaid;
		}
	});

	return Object.values(groups);
};

export default groupOrders;
