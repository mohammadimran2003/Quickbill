import express from 'express';
import {
	getProfitReport,
	getSalesReport,
	getStockReport,
} from '../controllers/reportControllers.js';

const reportRouter = express.Router();

reportRouter.get('/sales', getSalesReport);
reportRouter.get('/profits', getProfitReport);
reportRouter.get('/stocks', getStockReport);

export default reportRouter;
