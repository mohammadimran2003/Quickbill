import express from "express";
import {
  createPriceTier,
  deletePriceTier,
  editPriceTier,
} from "../controllers/priceTierControllers.js";
import validatorsMiddleware from "../middlewares/validatorsMiddleware.js";
import priceTierSchema from "../validations/priceTierValidations.js";
import restrictTo from "../middlewares/restrictTo.js";

const priceTierRouter = express.Router({ mergeParams: true });

priceTierRouter.post(
  "/",
  validatorsMiddleware(priceTierSchema),
  restrictTo("ADMIN", "MANAGER"),
  createPriceTier,
);

priceTierRouter.delete(
  "/:tierId",
  restrictTo("ADMIN", "MANAGER"),
  deletePriceTier,
);

priceTierRouter.put(
  "/:tierId",
  validatorsMiddleware(priceTierSchema),
  restrictTo("ADMIN", "MANAGER"),
  editPriceTier,
);

export default priceTierRouter;
