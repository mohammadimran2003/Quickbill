import api from '../axios';

const getCustomerByPhone = async (phone) => {
	const response = await api.get(`/customers/phone/${phone}`);
	return response.data;
};

export default getCustomerByPhone;
