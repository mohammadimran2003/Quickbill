import api from "../axios";

const getPurchaseById = async (id) => {
  const response = await api.get(`/purchases/${id}`);
  return response.data;
};

export default getPurchaseById;
