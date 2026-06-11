import api from "../axios.js";

const getPurchaseById = async (id) => {
  const response = await api.get(`/purchases/${id}`);
  return response.data;
};

export default getPurchaseById;
