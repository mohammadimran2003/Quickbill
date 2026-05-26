import api from "../axios.js";

const updateStore = async (data) => {
  const response = await api.put("/settings/store", data);
  return response.data;
};

export default updateStore;
