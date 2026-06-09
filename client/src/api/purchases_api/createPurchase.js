import api from "../axios";

const createPurchase = async (data) => {
  const response = await api.post("/purchases", data);
  return response.data;
};

export default createPurchase;
