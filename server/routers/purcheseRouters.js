import express from "express";
import {
  createPurchase,
  getPurchaseById,
  getPurchases,
  updatePurchase,
} from "../controllers/purchaseControllers.js";
import validatorsMiddleware from "../middlewares/validatorsMiddleware.js";
import purchaseSchema from "../validations/purchaseValidations.js";
import restrictTo from "../middlewares/restrictTo.js";

const purchaseRouter = express.Router();

purchaseRouter.post(
  "/",
  validatorsMiddleware(purchaseSchema),
  restrictTo("ADMIN", "MANAGER"),
  createPurchase,
);
purchaseRouter.get("/", getPurchases);
purchaseRouter.get("/:id", getPurchaseById);
purchaseRouter.put("/:id", restrictTo("ADMIN", "MANAGER"), updatePurchase);

export default purchaseRouter;
