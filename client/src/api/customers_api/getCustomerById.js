import api from '../axios';

const getCustomerById = async (id) => {
	const response = await api.get(`/customers/${id}`);
	console.log(response.data, 'resd');

	return response.data;
};

export default getCustomerById;
