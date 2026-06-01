import api from "../axios.js";

const getProfitReport = async (searchparams) => {
  const response = await api.get(`/reports/profits?${searchparams}`);

  return response.data;
};

export { getProfitReport };
