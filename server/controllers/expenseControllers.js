import prisma from "../lib/prisma.js";

const createExpenseCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const category = await prisma.expenseCategory.create({ data: { name } });

    res.status(201).json({
      success: true,
      data: category,
      message: "Expense category created successfully",
    });
  } catch (err) {
    console.log(err, "create expense error");
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getExpensesCategories = async (req, res) => {
  try {
    const categories = await prisma.expenseCategory.findMany();
    res.status(200).json({
      success: true,
      data: categories,
      message: "Expense categories retrieved successfully",
    });
  } catch (err) {
    console.log(err, "get expense categories error");
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const createExpense = async (req, res) => {
  try {
    const userId = req.user.id;

    const expense = await prisma.expense.create({
      data: { ...req.body, createdBy: userId },
    });

    res.status(201).json({
      success: true,
      data: expense,
      message: "Expense created successfully",
    });
  } catch (err) {
    console.log(err, "create expense error");
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const expense = await prisma.expense.update({
      where: { id },
      data: { ...req.body },
    });

    console.log(expense, "expense");

    res.status(200).json({
      success: true,
      data: expense,
      message: "Expense updated successfully",
    });
  } catch (err) {
    console.log(err, "edit expense error");
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;

    const expense = await prisma.expense.delete({
      where: { id },
    });
    res.status(200).json({
      success: true,
      data: expense,
      message: "Expense deleted successfully",
    });
  } catch (err) {
    if (err.code === "P2025") {
      return res
        .status(404)
        .json({ success: false, message: "Expense not found" });
    } else if (err.code === "P2023") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid ID format" });
    }
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getExpenses = async (req, res) => {
  try {
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
  } catch (err) {
    console.log(err, "get expenses error");
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getExpenseStats = async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const [allTimeTotal, thisMonthTotal, categoryStatsData] = await Promise.all(
      [
        prisma.expense.aggregate({ _sum: { amount: true } }),
        prisma.expense.aggregate({
          _sum: { amount: true },
          where: { date: { gte: startOfMonth, lte: endOfMonth } },
        }),
        prisma.expense.groupBy({
          by: ["categoryId"],
          _sum: { amount: true },
        }),
      ],
    );

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
  } catch (err) {
    console.log(err, "get expense stats error");
    res.status(500).json({ success: false, message: "Internal server error" });
  }
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
