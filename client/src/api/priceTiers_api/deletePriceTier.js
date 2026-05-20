import api from '../axios.js';

const deletePriceTier = async (productId, priceTierId) => {
	const response = await api.delete(
		`/products/${productId}/price-tiers/${priceTierId}`,
	);

	return response.data;
};

export default deletePriceTier;
