import express from "express";
import {
  createPriceTier,
  deletePriceTier,
  editPriceTier,
} from "../controllers/priceTierControllers.js";
import validatorsMiddleware from "../middlewares/validatorsMiddleware.js";
import priceTierSchema from "../validations/priceTierValidations.js";

const priceTierRouter = express.Router({ mergeParams: true });

priceTierRouter.post(
  "/",
  validatorsMiddleware(priceTierSchema),
  createPriceTier,
);

priceTierRouter.delete("/:tierId", deletePriceTier);
priceTierRouter.put(
  "/:tierId",
  validatorsMiddleware(priceTierSchema),
  editPriceTier,
);

export default priceTierRouter;
