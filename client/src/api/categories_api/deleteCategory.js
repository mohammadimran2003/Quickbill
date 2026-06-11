import api from "../axios.js";

const deleteCategory = async (id) => {
  const response = await api.delete(`/categories/${id}`);
  return response.data;
};

export default deleteCategory;
