import express from "express";
import { getStore, updateStore } from "../controllers/settingControllers.js";
import restrictTo from "../middlewares/restrictTo.js";

const settingRouter = express.Router();

settingRouter.get("/store", getStore);
settingRouter.put("/store", restrictTo("ADMIN", "MANAGER"), updateStore);

export default settingRouter;
