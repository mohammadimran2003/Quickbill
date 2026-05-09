import express from 'express';
import validatorsMiddleware from '../middlewares/validatorsMiddleware.js';
import orderSchema from '../validations/orderValidations.js';
import {
	createOrder,
	getOrders,
	getOrder,
	getLast30DaysOrders,
	getRecentOrders,
} from '../controllers/orderControllers.js';

const orderRouter = express.Router();
orderRouter.post('/', validatorsMiddleware(orderSchema), createOrder);
orderRouter.get('/', getOrders);
orderRouter.get('/last-30-days', getLast30DaysOrders);
orderRouter.get('/recent-orders', getRecentOrders);
orderRouter.get('/:id', getOrder);
export default orderRouter;
