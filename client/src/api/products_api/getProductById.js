import api from "../axios.js";

const getProductById = async (id) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

export default getProductById;
