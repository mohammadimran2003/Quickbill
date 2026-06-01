import prisma from "../lib/prisma.js";

const createExpenseCategory = async (req, res) => {
  const { name } = req.body;
  const category = await prisma.expenseCategory.create({ data: { name } });
  res.status(201).json({
    success: true,
    data: category,
    message: "Expense category created successfully",
  });
};

const getExpensesCategories = async (req, res) => {
  const categories = await prisma.expenseCategory.findMany();
  res.status(200).json({
    success: true,
    data: categories,
    message: "Expense categories retrieved successfully",
  });
};

const createExpense = async (req, res) => {
  const userId = req.user.id;

  const expense = await prisma.expense.create({
    data: { ...req.body, createdBy: userId },
  });

  res.status(201).json({
    success: true,
    data: expense,
    message: "Expense created successfully",
  });
};

const updateExpense = async (req, res) => {
  const { id } = req.params;
  const expense = await prisma.expense.update({
    where: { id },
    data: { ...req.body },
  });

  res.status(200).json({
    success: true,
    data: expense,
    message: "Expense updated successfully",
  });
};

const deleteExpense = async (req, res) => {
  const { id } = req.params;

  const expense = await prisma.expense.delete({
    where: { id },
  });
  res.status(200).json({
    success: true,
    data: expense,
    message: "Expense deleted successfully",
  });
};

const getExpenses = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const [expenses, total] = await Promise.all([
    prisma.expense.findMany({
      include: {
        category: true,
      },
      skip: (page - 1) * limit,
      take: parseInt(limit),
    }),
    prisma.expense.count(),
  ]);

  res.status(200).json({
    success: true,
    data: expenses,
    message: "Expenses retrieved successfully",
    count: total,
  });
};

const getExpenseStats = async (req, res) => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const [allTimeTotal, thisMonthTotal, categoryStatsData] = await Promise.all([
    prisma.expense.aggregate({ _sum: { amount: true } }),
    prisma.expense.aggregate({
      _sum: { amount: true },
      where: { date: { gte: startOfMonth, lte: endOfMonth } },
    }),
    prisma.expense.groupBy({
      by: ["categoryId"],
      _sum: { amount: true },
    }),
  ]);

  const categoryIds = categoryStatsData.map((item) => item.categoryId);

  const categories = await prisma.expenseCategory.findMany({
    where: { id: { in: categoryIds } },
  });

  const formatedCategories = categoryStatsData.reduce((acc, item) => {
    const category = categories.find((cat) => cat.id === item.categoryId);
    const name = category?.name || "Unknown";
    acc[name] = item._sum.amount || 0;
    return acc;
  }, {});

  res.status(200).json({
    success: true,
    data: {
      thisMonth: thisMonthTotal._sum.amount || 0,
      allTime: allTimeTotal._sum.amount || 0,
      byCategory: formatedCategories,
    },
    message: "Expense statistics retrieved successfully",
  });
};

export {
  createExpense,
  getExpenses,
  createExpenseCategory,
  updateExpense,
  deleteExpense,
  getExpensesCategories,
  getExpenseStats,
};
