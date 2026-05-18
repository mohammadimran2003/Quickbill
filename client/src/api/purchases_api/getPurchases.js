import api from '../axios';

const getPurchases = async (params) => {
	const response = await api.get('/purchases', { params });
	return response.data;
};

export default getPurchases;
