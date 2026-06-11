import api from "../axios.js";

const createExpenseCategory = async (data) => {
  const response = await api.post("/expenses/categories", data);

  return response.data;
};

export default createExpenseCategory;
