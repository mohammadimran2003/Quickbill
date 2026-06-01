import express from "express";
import {
  resetPassword,
  getUsers,
  updateUser,
  createUser,
} from "../controllers/userController.js";
import validatorsMiddleware from "../middlewares/validatorsMiddleware.js";
import {
  updateUserSchema,
  createUserSchema,
} from "../validations/userValidations.js";
import restrictTo from "../middlewares/restrictTo.js";

const userRouter = express.Router();

userRouter.post(
  "/",
  validatorsMiddleware(createUserSchema),
  restrictTo("ADMIN", "MANAGER"),
  createUser,
);
userRouter.get("/", getUsers);
userRouter.post("/reset-password/:id", resetPassword);
userRouter.put(
  "/:id",
  validatorsMiddleware(updateUserSchema),
  restrictTo("ADMIN", "MANAGER"),
  updateUser,
);
userRouter.patch("/reset-password/:id", resetPassword);

export default userRouter;
