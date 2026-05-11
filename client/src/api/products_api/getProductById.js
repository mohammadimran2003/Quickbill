import api from '../axios';

const getProductById = async (id) => {
	const response = await api.get(`/products/${id}`);
	return response.data;
};

export default getProductById;
