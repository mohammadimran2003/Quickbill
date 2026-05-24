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

const productRouter = express.Router();

productRouter.post("/", validatorsMiddleware(productsSchema), createProduct);
productRouter.get("/", getAllProducts);
productRouter.get("/low-stock", getLowStockProduct);
productRouter.get("/:id", validateObjectId, getProductById);
productRouter.delete("/:id", validateObjectId, deleteProduct);
productRouter.put("/:id", validatorsMiddleware(productsSchema), editProduct);

export default productRouter;
