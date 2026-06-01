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
import verifyToken from "../middlewares/verifyToken.js";

const brandRouter = express.Router();

brandRouter.post("/", validatorsMiddleware(createBrandSchema), createBrand);
brandRouter.get("/", getAllBrands);
brandRouter.get("/:id", getBrandById);
brandRouter.delete("/:id", deleteBrand);
brandRouter.put("/:id", editBrand);

export default brandRouter;
