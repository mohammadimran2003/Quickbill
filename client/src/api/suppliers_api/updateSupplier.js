import api from '../axios';

const updateSupplier = async (id, data) => {
	const response = await api.put(`/suppliers/${id}`, data);
	return response.data;
};

export default updateSupplier;
