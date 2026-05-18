import express from 'express';
import {
	createPurchase,
	deletePurchase,
	getPurchaseById,
	getPurchases,
	updatePurchase,
} from '../controllers/purchaseControllers.js';
import validatorsMiddleware from '../middlewares/validatorsMiddleware.js';
import purchaseSchema from '../validations/purchaseValidations.js';

const purchaseRouter = express.Router();

purchaseRouter.post('/', validatorsMiddleware(purchaseSchema), createPurchase);
purchaseRouter.get('/', getPurchases);
purchaseRouter.get('/:id', getPurchaseById);
purchaseRouter.put('/:id', updatePurchase);
purchaseRouter.delete('/:id', deletePurchase);

export default purchaseRouter;
