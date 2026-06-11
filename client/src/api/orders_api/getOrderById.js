import api from "../axios.js";

const getOrderById = async (id) => {
  const response = await api.get(`/orders/${id}`);
  return response.data;
};

export default getOrderById;
