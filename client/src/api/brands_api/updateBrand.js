import api from '../axios';

const updateBrand = async (id, data) => {
	const response = await api.put(`/brands/${id}`, data);
	return response.data;
};

export default updateBrand;
