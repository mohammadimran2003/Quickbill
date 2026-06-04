import api from "../axios";

const getCustomers = async (params) => {
  const response = await api.get("/customers", { params });

  return response.data;
};

export default getCustomers;
