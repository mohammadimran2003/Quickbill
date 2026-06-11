import api from "../axios.js";

const getCustomerByPhone = async (phone) => {
  const response = await api.get(`/customers/phone/${phone}`);
  return response.data;
};

export default getCustomerByPhone;
