import api from "../axios.js";

const getCategories = async (params) => {
  const response = await api.get("/categories", { params });

  return response.data;
};

export default getCategories;
