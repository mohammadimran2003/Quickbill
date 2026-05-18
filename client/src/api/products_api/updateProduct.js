import api from '../axios';

const updateProduct = async (id, data) => {
	console.log(data, 'updated data');

	const response = await api.put(`/products/${id}`, data);
	return response.data;
};

export default updateProduct;
