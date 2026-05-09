import api from '../axios';

const getOrders = async (params) => {
	const response = await api.get('/orders', { params });

	return response.data;
};

export default getOrders;
