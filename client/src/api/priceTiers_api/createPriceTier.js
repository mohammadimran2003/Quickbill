import api from '../axios.js';

const createPriceTier = async (productId, data) => {
	console.log(productId, 'productId');

	const response = await api.post(`/products/${productId}/price-tiers`, data);
	console.log(response.data, 'data');

	return response.data;
};

export default createPriceTier;
