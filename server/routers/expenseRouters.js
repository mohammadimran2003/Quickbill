import express from "express";
import {
  createExpense,
  getExpenses,
  createExpenseCategory,
  getExpensesCategories,
  updateExpense,
  deleteExpense,
  getExpenseStats,
} from "../controllers/expenseControllers.js";
import {
  createExpenseCategorySchema,
  createExpenseSchema,
} from "../validations/expenseValidations.js";
import validatorsMiddleware from "../middlewares/validatorsMiddleware.js";

const expenseRouter = express.Router();

expenseRouter.post(
  "/categories",
  validatorsMiddleware(createExpenseCategorySchema),
  createExpenseCategory,
);
expenseRouter.get("/categories", getExpensesCategories);
expenseRouter.post(
  "/",
  validatorsMiddleware(createExpenseSchema),
  createExpense,
);
expenseRouter.put(
  "/:id",
  validatorsMiddleware(createExpenseSchema),
  updateExpense,
);
expenseRouter.delete("/:id", deleteExpense);
expenseRouter.get("/", getExpenses);
expenseRouter.get("/stats", getExpenseStats);

export default expenseRouter;
