import api from "../axios.js";

const createCustomer = async (data) => {
  const response = await api.post("/customers", data);
  return response.data;
};

export default createCustomer;
