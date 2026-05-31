import api from "../axios";

const deleteExpense = async (id) => {
  const response = await api.delete(`/expenses/${id}`);

  return response.data;
};

export default deleteExpense;
