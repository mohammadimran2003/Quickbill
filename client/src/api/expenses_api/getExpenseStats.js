import api from "../axios";

const getExpenseStats = async () => {
  const response = await api.get("/expenses/stats");

  return response.data;
};

export default getExpenseStats;
