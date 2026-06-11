import api from "../axios.js";

const deleteBrand = async (id) => {
  const response = await api.delete(`/brands/${id}`);
  return response.data;
};

export default deleteBrand;
