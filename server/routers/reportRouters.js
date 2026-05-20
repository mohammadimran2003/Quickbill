import express from 'express';
import {
	getProfitReport,
	getSalesReport,
} from '../controllers/reportControllers.js';

const reportRouter = express.Router();

reportRouter.get('/sales', getSalesReport);
reportRouter.get('/profits', getProfitReport);

export default reportRouter;
