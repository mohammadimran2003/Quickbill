import express from "express";
import {
  createExpense,
  getExpenses,
  createExpenseCategory,
  getExpensesCategories,
  updateExpense,
  deleteExpense,
  getExpenseStats,
  getExpensesChart,
} from "../controllers/expenseControllers.js";
import {
  createExpenseCategorySchema,
  createExpenseSchema,
} from "../validations/expenseValidations.js";
import validatorsMiddleware from "../middlewares/validatorsMiddleware.js";
import restrictTo from "../middlewares/restrictTo.js";

const expenseRouter = express.Router();

expenseRouter.post(
  "/categories",
  validatorsMiddleware(createExpenseCategorySchema),
  restrictTo("ADMIN", "MANAGER"),
  createExpenseCategory,
);

expenseRouter.get("/categories", getExpensesCategories);

expenseRouter.post(
  "/",
  validatorsMiddleware(createExpenseSchema),
  restrictTo("ADMIN", "MANAGER"),
  createExpense,
);

expenseRouter.put(
  "/:id",
  validatorsMiddleware(createExpenseSchema),
  restrictTo("ADMIN", "MANAGER"),
  updateExpense,
);

expenseRouter.delete("/:id", restrictTo("ADMIN", "MANAGER"), deleteExpense);

expenseRouter.get("/", getExpenses);
expenseRouter.get("/stats", getExpenseStats);
expenseRouter.get("/chart", getExpensesChart);

export default expenseRouter;
