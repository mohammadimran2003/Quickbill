import express from "express";
import {
  createBrand,
  getAllBrands,
  getBrandById,
  deleteBrand,
  editBrand,
} from "../controllers/brandControllers.js";
import validatorsMiddleware from "../middlewares/validatorsMiddleware.js";
import { createBrandSchema } from "../validations/brandValidations.js";
import restrictTo from "../middlewares/restrictTo.js";

const brandRouter = express.Router();

brandRouter.post(
  "/",
  validatorsMiddleware(createBrandSchema),
  restrictTo("ADMIN", "MANAGER"),
  createBrand,
);
brandRouter.get("/", getAllBrands);
brandRouter.get("/:id", getBrandById);
brandRouter.delete("/:id", restrictTo("ADMIN", "MANAGER"), deleteBrand);
brandRouter.put("/:id", restrictTo("ADMIN", "MANAGER"), editBrand);

export default brandRouter;
