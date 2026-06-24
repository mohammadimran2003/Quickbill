import api from '../axios.js';

const deleteCustomer = async (id) => {
	const response = await api.delete(`/customers/${id}`);
	return response.data;
};

export default deleteCustomer;
