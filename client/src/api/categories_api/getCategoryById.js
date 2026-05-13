import api from '../axios';

const getCategoryById = async (id) => {
	const response = await api.get(`/categories/${id}`);

	return response.data;
};

export default getCategoryById;
