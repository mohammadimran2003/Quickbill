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

const getMonthlyPurchaseSales = async (req, res) => {
  try {
    // 🧠 ১. গত ১২ মাসের শুরুর তারিখ জেনারেট করা (টাইম জিরো করে)
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 11);
    startDate.setDate(1);
    startDate.setHours(0, 0, 0, 0);

    // 🚀 ২. ডাটাবেজ লেভেলে এগ্রিগেশন (groupBy) রান করা
    // প্রিজমাই সরাসরি ডাটা যোগ (Sum) করে শুধু মাসের রেজাল্টটুকু রিটার্ন করবে
    const [salesData, purchaseData] = await Promise.all([
      prisma.order.groupBy({
        by: ["year", "month"],
        where: { date: { gte: startDate }, status: "COMPLETED" }, // শুধু কমপ্লিটেড অর্ডার
        _sum: { total: true },
      }),
      prisma.purchase.groupBy({
        by: ["year", "month"],
        where: { date: { gte: startDate }, status: "RECEIVED" },
        _sum: { total: true },
      }),
    ]);

    console.log(salesData, "Sales data");
    console.log(purchaseData, "Purchase data");

    const chartDataMap = {};
    const monthsOrder = [];

    for (let i = 0; i < 12; i++) {
      const currentMonthDate = new Date(
        startDate.getFullYear(),
        startDate.getMonth() + i,
        1,
      );
      const monthLabel = currentMonthDate.toLocaleString("en-US", {
        month: "short",
      }); // "Jan", "Feb"
      const yearVal = currentMonthDate.getFullYear();
      const uniqueKey = `${yearVal}-${monthLabel}`;

      chartDataMap[uniqueKey] = {
        month: monthLabel,
        sales: 0,
        purchase: 0,
      };
      monthsOrder.push(uniqueKey);
    }

    console.log(chartDataMap, "Chart data map");
    console.log(monthsOrder, "Months order");

    salesData.forEach((item) => {
      const uniqueKey = `${item.year}-${item.month}`;
      if (chartDataMap[uniqueKey]) {
        chartDataMap[uniqueKey].sales = item._sum.total || 0;
      }
    });

    purchaseData.forEach((item) => {
      const uniqueKey = `${item.year}-${item.month}`;
      if (chartDataMap[uniqueKey]) {
        chartDataMap[uniqueKey].purchase = item._sum.total || 0;
      }
    });

    const finalChartData = monthsOrder.map((key) => chartDataMap[key]);

    console.log(finalChartData, "finalchart");

    return res.status(200).json({
      success: true,
      chartData: finalChartData,
      message: "Monthly purchase and sales data aggregated successfully",
    });
  } catch (error) {
    console.error("Monthly Chart Fetch Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export { getDashboardSummery, getTopProducts, getMonthlyPurchaseSales };
