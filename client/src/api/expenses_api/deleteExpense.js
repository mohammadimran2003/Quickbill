import api from "../axios.js";

const deleteExpense = async (id) => {
  const response = await api.delete(`/expenses/${id}`);

  return response.data;
};

export default deleteExpense;
