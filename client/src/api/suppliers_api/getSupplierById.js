import api from '../axios';

const getSupplierById = async (id) => {
	const response = await api.get(`/suppliers/${id}`);
	return response.data;
};

export default getSupplierById;
