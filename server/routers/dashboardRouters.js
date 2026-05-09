import express from 'express';
import {
	getDashboardSummery,
	getTopProducts,
} from '../controllers/dashboardControllers.js';

const dashboardRouter = express.Router();

dashboardRouter.get('/summery', getDashboardSummery);
dashboardRouter.get('/top-products', getTopProducts);

export default dashboardRouter;
