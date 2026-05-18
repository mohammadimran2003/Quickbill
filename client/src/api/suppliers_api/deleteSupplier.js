import api from '../axios';

const deleteSupplier = async (id) => {
	const response = await api.delete(`/suppliers/${id}`);
	return response.data;
};

export default deleteSupplier;
