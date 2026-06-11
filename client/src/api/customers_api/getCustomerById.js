import api from "../axios.js";

const getCustomerById = async (id) => {
  const response = await api.get(`/customers/${id}`);

  return response.data;
};

export default getCustomerById;
