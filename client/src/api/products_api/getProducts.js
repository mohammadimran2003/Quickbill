import api from '../axios';

const getProducts = async (params) => {
	const response = await api.get('/products', { params });
	return response.data;
};

export default getProducts;
