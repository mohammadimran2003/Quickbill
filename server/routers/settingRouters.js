import express from "express";
import { getStore, updateStore } from "../controllers/settingControllers.js";

const settingRouter = express.Router();

settingRouter.get("/store", getStore);
settingRouter.put("/store", updateStore);

export default settingRouter;
