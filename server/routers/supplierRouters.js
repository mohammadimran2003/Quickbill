import express from 'express';
import {
	createSuppliser,
	getSuppliers,
	updateSupplier,
	deleteSupplier,
	getSupplierById,
} from '../controllers/supplierControllers.js';
import { supplierSchema } from '../validations/supplierValidations.js';
import validatorsMiddleware from '../middlewares/validatorsMiddleware.js';

const supplierRouter = express.Router();

supplierRouter.post('/', validatorsMiddleware(supplierSchema), createSuppliser);
supplierRouter.get('/', getSuppliers);
supplierRouter.get('/:id', getSupplierById);
supplierRouter.put('/:id', updateSupplier);
supplierRouter.delete('/:id', deleteSupplier);

export default supplierRouter;
