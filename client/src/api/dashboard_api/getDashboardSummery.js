import api from '../axios';

const getDashboardSummery = async () => {
	try {
		const response = await api.get('/dashboard/summery');
		return response.data;
	} catch (error) {
		console.error('Error fetching dashboard summary:', error);
		throw error;
	}
};

export default getDashboardSummery;
