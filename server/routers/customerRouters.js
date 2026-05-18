import express from 'express';
import {
	createCustomer,
	getCustomers,
	getCustomerById,
	deleteCustomer,
	updateCustomer,
	rechargeWallet,
	getCustomerOrders,
	getCustomerByPhone,
} from '../controllers/customerControllers.js';
import validatorsMiddleware from '../middlewares/validatorsMiddleware.js';
import { customerSchema } from '../validations/customersValidations.js';
import walletTransactionSchema from '../validations/walletValidations.js';

const customerRouter = express.Router();

customerRouter.post('/', validatorsMiddleware(customerSchema), createCustomer);
customerRouter.get('/', getCustomers);
customerRouter.get('/:id', getCustomerById);
customerRouter.delete('/:id', deleteCustomer);
customerRouter.put(
	'/:id',
	validatorsMiddleware(customerSchema),
	updateCustomer,
);

customerRouter.put(
	'/:id/wallet/recharge',
	validatorsMiddleware(walletTransactionSchema),
	rechargeWallet,
);

customerRouter.get('/:id/orders', getCustomerOrders);
customerRouter.get('/phone/:phone', getCustomerByPhone);

export default customerRouter;
