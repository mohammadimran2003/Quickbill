import api from "../axios.js";

const getExpenseCategories = async () => {
  const response = await api.get("/expenses/categories");

  return response.data;
};

export default getExpenseCategories;
