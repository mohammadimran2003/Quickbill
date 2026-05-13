import api from '../axios';

const updateBrand = async (id, data) => {
	console.log(id.length, data, 'id r data');

	const response = await api.put(`/brands/${id}`, data);
	return response.data;
};

export default updateBrand;
