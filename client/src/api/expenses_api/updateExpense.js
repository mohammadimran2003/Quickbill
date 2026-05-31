import api from "../axios";

const updateExpense = async (id, data) => {
  const response = await api.put(`/expenses/${id}`, data);

  return response.data;
};

export default updateExpense;
