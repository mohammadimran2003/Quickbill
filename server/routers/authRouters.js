import express from "express";
import {
  register,
  login,
  logout,
  getMe,
  updateUser,
  getUsers,
} from "../controllers/authControllers.js";
import verifyToken from "../middlewares/verifyToken.js";
import validatorsMiddleware from "../middlewares/validatorsMiddleware.js";
import { userSchema } from "../validations/userValidations.js";
const authRouter = express.Router();

authRouter.post("/register", validatorsMiddleware(userSchema), register);

authRouter.put("/users/:id", updateUser);
authRouter.get("/users", getUsers);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.get("/me", verifyToken, getMe);

export default authRouter;
