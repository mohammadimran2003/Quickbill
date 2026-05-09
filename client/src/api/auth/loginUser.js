import api from '../axios';

const loginUser = async (data) => {
	const { email, password } = data;
	const response = await api.post('/auth/login', { email, password });
	console.log(response.data, 'login user ');

	return response.data;
};

export default loginUser;
