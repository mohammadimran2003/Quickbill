import api from "../axios.js";

const deleteProduct = async (id) => {
  const response = await api.delete(`/products/${id}`);
  return response.data;
};

export default deleteProduct;
