import axios from '../axios';

const deleteBrand = async (id) => {
	const response = await axios.delete(`/brands/${id}`);
	return response.data;
};

export default deleteBrand;
