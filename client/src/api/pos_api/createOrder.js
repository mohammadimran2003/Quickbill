import api from '../axios';

const createOrder = async (data) => {
	const response = await api.post('/orders', data);
	return response.data;
};

export default createOrder;
