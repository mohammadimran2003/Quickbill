import api from "../axios.js";

const getPurchases = async (params) => {
  const response = await api.get("/purchases", { params });
  return response.data;
};

export default getPurchases;
