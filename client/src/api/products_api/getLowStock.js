import api from "../axios.js";

export const getLowStock = async () => {
  const response = await api.get("/products/low-stock");
  return response.data;
};
