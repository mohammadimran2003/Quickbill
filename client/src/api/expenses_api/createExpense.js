import api from "../axios.js";

const createExpense = async (data) => {
  const response = await api.post("/expenses", data);

  return response.data;
};

export default createExpense;
