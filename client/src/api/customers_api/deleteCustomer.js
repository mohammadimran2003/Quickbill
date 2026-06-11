import api from "../axios.js";


const deleteCustomer = async (id) => {
	const response = await axios.delete(`/customers/${id}`);
	return response.data;
};

export default deleteCustomer;
