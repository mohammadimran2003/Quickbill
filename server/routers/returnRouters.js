import express from "express";
import { createReturn } from "../controllers/returnControllers.js";
const returnRouter = express.Router();

returnRouter.post('/', createReturn) 

export default returnRouter;