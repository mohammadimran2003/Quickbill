import express from "express";
import {
  createCustomer,
  getCustomers,
  getCustomerById,
  deleteCustomer,
  updateCustomer,
  rechargeWallet,
  getCustomerOrders,
  getCustomerByPhone,
} from "../controllers/customerControllers.js";
import validatorsMiddleware from "../middlewares/validatorsMiddleware.js";
import { customerSchema } from "../validations/customersValidations.js";
import { walletRechargeSchema } from "../validations/walletValidations.js";
import restrictTo from "../middlewares/restrictTo.js";

const customerRouter = express.Router();

customerRouter.post("/", validatorsMiddleware(customerSchema), createCustomer);
customerRouter.get("/", getCustomers);
customerRouter.get("/:id", getCustomerById);
customerRouter.delete("/:id", restrictTo("ADMIN", "MANAGER"), deleteCustomer);
customerRouter.put(
  "/:id",
  validatorsMiddleware(customerSchema),
  restrictTo("ADMIN", "MANAGER"),
  updateCustomer,
);

customerRouter.put(
  "/:id/wallet/recharge",
  validatorsMiddleware(walletRechargeSchema),
  restrictTo("ADMIN", "MANAGER"),
  rechargeWallet,
);

customerRouter.get("/:id/orders", getCustomerOrders);
customerRouter.get("/phone/:phone", getCustomerByPhone);

export default customerRouter;
