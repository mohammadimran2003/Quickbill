import api from "../axios.js";

const getExpensesChart = async () => {
  const response = await api.get("/expenses/chart");
  return response.data;
};

export default getExpensesChart;
