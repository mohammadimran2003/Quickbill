import api from "../axios";

const getExpenses = async (params) => {
  const response = await api.get("/expenses", { params });

  return response.data;
};

export default getExpenses;
