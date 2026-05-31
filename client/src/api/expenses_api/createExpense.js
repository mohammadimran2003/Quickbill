import api from "../axios";

const createExpense = async (data) => {
  const response = await api.post("/expenses", data);

  return response.data;
};

export default createExpense;
