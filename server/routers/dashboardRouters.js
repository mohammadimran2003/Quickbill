import express from "express";
import {
  getDashboardSummery,
  getTopProducts,
  getMonthlyPurchaseSales,
} from "../controllers/dashboardControllers.js";

const dashboardRouter = express.Router();

dashboardRouter.get("/summery", getDashboardSummery);
dashboardRouter.get("/top-products", getTopProducts);
dashboardRouter.get("/monthly-purchase-sales", getMonthlyPurchaseSales);

export default dashboardRouter;
