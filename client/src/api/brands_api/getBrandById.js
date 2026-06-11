import api from "../axios.js";

const getBrandById = async (id) => {
  const response = await api.get(`/brands/${id}`);

  return response.data;
};

export default getBrandById;
