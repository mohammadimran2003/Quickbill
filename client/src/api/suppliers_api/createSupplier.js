import api from '../axios';

const createSupplier = async (data) => {
	const response = await api.post('/suppliers', data);
	return response.data;
};

export default createSupplier;
