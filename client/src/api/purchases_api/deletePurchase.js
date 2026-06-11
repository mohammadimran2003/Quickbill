import api from "../axios.js";

const deletePurchase = async (id) => {
  const response = await api.delete(`/purchases/${id}`);
  return response.data;
};

export default deletePurchase;
