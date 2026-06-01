import prisma from "../lib/prisma.js";

const getDashboardSummery = async (req, res) => {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  const [todayOrders, allTimeOrders] = await Promise.all([
    prisma.order.aggregate({
      where: {
        status: "COMPLETED",
        createdAt: {
          gte: todayStart,
          lte: todayEnd,
        },
      },
      _sum: {
        total: true,
        totalCostPrice: true,
      },
      _count: true,
    }),
    prisma.order.aggregate({
      where: { status: "COMPLETED" },
      _sum: {
        total: true,
        totalCostPrice: true,
      },
      _count: true,
    }),
  ]);

  const todaySales = todayOrders._sum.total || 0;
  const todayCost = todayOrders._sum.totalCostPrice || 0;
  const allTimeRevenue = allTimeOrders._sum.total || 0;
  const allTimeCost = allTimeOrders._sum.totalCostPrice || 0;

  return res.status(200).json({
    success: true,
    data: {
      today: {
        sales: todaySales,
        orders: todayOrders._count,
        profit: todaySales - todayCost,
      },
      allTime: {
        revenue: allTimeRevenue,
        orders: allTimeOrders._count,
        profit: allTimeRevenue - allTimeCost,
      },
    },
  });
};

const getTopProducts = async (req, res) => {
  const topProducts = await prisma.orderItem.groupBy({
    by: ["productId", "productName"],
    where: {
      order: { status: "COMPLETED" },
    },
    orderBy: {
      _sum: { quantity: "desc" },
    },
    _sum: {
      quantity: true,
      total: true,
    },
    take: 5,
  });

  const formattedTopProducts = topProducts.map((item) => ({
    name: item.productName,
    totalSales: item._sum.total,
  }));

  res.status(200).json({
    success: true,
    message: "Top product retrieved successfully",
    data: formattedTopProducts,
  });
};

export { getDashboardSummery, getTopProducts };
