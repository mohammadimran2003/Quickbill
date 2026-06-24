import api from '../axios';

const getWalkInCustomer = async () => {
	const walkInCustomer = await api.get(`/customers/walk-in`);
	return walkInCustomer.data;
};

export default getWalkInCustomer;
