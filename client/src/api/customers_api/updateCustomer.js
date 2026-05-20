import api from '../axios';

const updateCustomer = async (id, data) => {
	const response = await api.put(`/customers/${id}`, data);
	return response.data;
};

export default updateCustomer;
