import api from '../axios.js';

const createPriceTier = async (productId, data) => {
	const response = await api.post(`/products/${productId}/price-tiers`, data);

	return response.data;
};

export default createPriceTier;
