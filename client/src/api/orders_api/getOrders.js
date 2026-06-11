import api from "../axios.js";

const getOrders = async (params) => {
  const response = await api.get("/orders", { params });

  return response.data;
};

export default getOrders;
