import api from '../axios';

const deletePurchase = async (id) => {
	const response = await api.delete(`/purchases/${id}`);
	return response.data;
};

export default deletePurchase;
