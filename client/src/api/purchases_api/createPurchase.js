import api from "../axios.js";

const createPurchase = async (data) => {
  const response = await api.post("/purchases", data);
  return response.data;
};

export default createPurchase;
