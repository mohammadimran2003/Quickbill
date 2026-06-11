import api from "../axios.js";

const getStockReports = async (searchparams) => {
  const response = await api.get(`/reports/stocks?${searchparams}`);
  return response.data;
};

export default getStockReports;
