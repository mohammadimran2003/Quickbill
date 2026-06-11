import api from "../axios.js";

const updatePurchase = async (id, data) => {
  const response = await api.put(`/purchases/${id}`, data);
  return response.data;
};

export default updatePurchase;
