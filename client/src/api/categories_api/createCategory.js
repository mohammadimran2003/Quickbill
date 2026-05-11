import api from '../axios';

const createCategory = async (data) => {
	const response = await api.post('/categories', data);
	return response.data;
};

export default createCategory;
