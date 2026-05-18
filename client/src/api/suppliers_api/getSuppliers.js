import api from '../axios';

const getSuppliers = async (params) => {
	const response = await api.get('/suppliers', { params });
	return response.data;
};

export default getSuppliers;
