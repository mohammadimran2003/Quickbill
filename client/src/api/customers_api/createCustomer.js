import api from "../axios";

const createCustomer = async (data) => {
  const response = await api.post("/customers", data);
  return response.data;
};

export default createCustomer;
