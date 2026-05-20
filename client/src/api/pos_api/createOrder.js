import orderSchema from '../../validations/orderValidations';
import api from '../axios';

const createOrder = async (data) => {
	const validation = orderSchema.safeParse(data);

	if (!validation.success) {
		const errorMessages = validation.error.issues
			.map((issue) => issue.message)
			.join(', ');

		throw new Error(errorMessages);
	}

	const response = await api.post('/orders', data);

	return response.data;
};

export default createOrder;
