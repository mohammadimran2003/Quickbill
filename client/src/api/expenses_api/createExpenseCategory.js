import api from "../axios";

const createExpenseCategory = async (data) => {
  const response = await api.post("/expenses/categories", data);

  return response.data;
};

export default createExpenseCategory;
