import api from "../axios";

const getStockReports = async (searchparams) => {
  const response = await api.get(`/reports/stocks?${searchparams}`);
  return response.data;
};

export default getStockReports;
