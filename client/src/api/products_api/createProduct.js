import api from '../axios';

const createProduct = async (data) => {
	const response = await api.post('/products', data);
	return response.data;
};

export default createProduct;
