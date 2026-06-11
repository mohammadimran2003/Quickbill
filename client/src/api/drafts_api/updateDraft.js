import api from "../axios.js";

const updateDraft = async (draftData) => {
  const { id, items } = draftData;
  const response = await api.put(`/drafts/${id}`, { items });
  return response.data;
};

export default updateDraft;
