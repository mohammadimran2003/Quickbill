import api from '../axios';

const updateCustomer = async (id, data) => {
	console.log(id, data, 'data');

	const response = await api.put(`/customers/${id}`, data);
	return response.data;
};

export default updateCustomer;
