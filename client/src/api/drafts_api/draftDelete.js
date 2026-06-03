import api from "../axios.js";

const deleteDraft = async (id) => {
  const response = await api.delete(`/drafts/${id}`);
  return response.data;
};

export default deleteDraft;
