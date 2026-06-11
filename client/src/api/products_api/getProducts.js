import api from "../axios.js";

const getProducts = async (params) => {
  const response = await api.get("/products", { params });
  return response.data;
};

export default getProducts;
