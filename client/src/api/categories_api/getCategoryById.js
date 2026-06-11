import api from "../axios.js";

const getCategoryById = async (id) => {
  const response = await api.get(`/categories/${id}`);

  return response.data;
};

export default getCategoryById;
