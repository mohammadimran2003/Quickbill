import express from "express";
import {
  createSuppliser,
  getSuppliers,
  updateSupplier,
  deleteSupplier,
  getSupplierById,
} from "../controllers/supplierControllers.js";
import { supplierSchema } from "../validations/supplierValidations.js";
import validatorsMiddleware from "../middlewares/validatorsMiddleware.js";
import restrictTo from "../middlewares/restrictTo.js";

const supplierRouter = express.Router();

supplierRouter.post(
  "/",
  validatorsMiddleware(supplierSchema),
  restrictTo("ADMIN", "MANAGER"),
  createSuppliser,
);
supplierRouter.get("/", getSuppliers);
supplierRouter.get("/:id", getSupplierById);
supplierRouter.put("/:id", restrictTo("ADMIN", "MANAGER"), updateSupplier);
supplierRouter.delete("/:id", restrictTo("ADMIN", "MANAGER"), deleteSupplier);

export default supplierRouter;
