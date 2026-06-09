import api from "../axios.js";

const getSalesReport = async (searchparams) => {
  const response = await api.get(`/reports/sales?${searchparams}`);
  return response.data;
};

export { getSalesReport };
