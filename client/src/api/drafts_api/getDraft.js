import api from "../axios.js";

const getDraft = async (id) => {
  const response = await api.get(`/drafts/${id}`);
  return response.data;
};

export default getDraft;
