import express from "express";
import {
  createProduct,
  getAllProducts,
  deleteProduct,
  getProductById,
  editProduct,
  getLowStockProduct,
} from "../controllers/productControllers.js";
import validateObjectId from "../middlewares/validateObjectId.js";
import validatorsMiddleware from "../middlewares/validatorsMiddleware.js";
import productsSchema from "../validations/productValidations.js";
import restrictTo from "../middlewares/restrictTo.js";

const productRouter = express.Router();

productRouter.post(
  "/",
  validatorsMiddleware(productsSchema),
  restrictTo("ADMIN", "MANAGER"),
  createProduct,
);
productRouter.get("/", getAllProducts);
productRouter.get("/low-stock", getLowStockProduct);
productRouter.get("/:id", validateObjectId, getProductById);
productRouter.delete(
  "/:id",
  validateObjectId,
  restrictTo("ADMIN", "MANAGER"),
  deleteProduct,
);
productRouter.put(
  "/:id",
  validatorsMiddleware(productsSchema),
  restrictTo("ADMIN", "MANAGER"),
  editProduct,
);

export default productRouter;
