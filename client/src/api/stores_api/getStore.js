import api from "../axios.js";

const getStore = async () => {
  const response = await api.get("/settings/store");
  return response.data;
};

export default getStore;
