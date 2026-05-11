import api from '../axios';

const createBrand = async (data) => {
	const response = await api.post('/brands', data);
	return response.data;
};

export default createBrand;