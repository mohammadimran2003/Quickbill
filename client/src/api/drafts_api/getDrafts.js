import api from "../axios.js";

const getDrafts = async () => {
  const response = await api.get("/drafts");
  return response.data;
};

export default getDrafts;
