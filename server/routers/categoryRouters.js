import express from "express";
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  deleteCategory,
  editCategory,
} from "../controllers/categoryControllers.js";
import validatorsMiddleware from "../middlewares/validatorsMiddleware.js";
import { createCategorySchema } from "../validations/categoryValidations.js";
import restrictTo from "../middlewares/restrictTo.js";

const categoryRouter = express.Router();

//create category
categoryRouter.post(
  "/",
  validatorsMiddleware(createCategorySchema),
  createCategory,
);

// get all category
categoryRouter.get("/", getAllCategories);

// get category by id
categoryRouter.get("/:id", getCategoryById);

//delete category
categoryRouter.delete("/:id", restrictTo("ADMIN", "MANAGER"), deleteCategory);

//edit category
categoryRouter.put("/:id", restrictTo("ADMIN", "MANAGER"), editCategory);

export default categoryRouter;
