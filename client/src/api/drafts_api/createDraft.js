import api from "../axios.js";

const createDraft = async (draftData) => {
  const response = await api.post("/drafts", draftData);
  return response.data;
};

export default createDraft;
