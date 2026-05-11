import axios from '../axios';

const deleteCategory = async (id) => {
	const response = await axios.delete(`/categories/${id}`);
	return response.data;
};

export default deleteCategory;
