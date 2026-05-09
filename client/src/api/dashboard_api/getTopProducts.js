import api from '../axios';
const getTopProducts = async () => {
	try {
		const respone = await api.get('/dashboard/top-products');
		return respone.data;
	} catch (err) {
		console.log(err);
		throw err;
	}
};

export default getTopProducts;
