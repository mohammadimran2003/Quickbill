import api from '../axios.js';

const deletePriceTier = async (productId, priceTierId) => {
	console.log(productId, priceTierId, 'id');

	const response = await api.delete(
		`/products/${productId}/price-tiers/${priceTierId}`,
	);
	console.log(response.data, 'data');

	return response.data;
};

export default deletePriceTier;
