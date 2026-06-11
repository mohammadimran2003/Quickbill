import api from "../axios.js";

const getBrands = async (params) => {
  const response = await api.get("/brands", { params });

  return response.data;
};

export default getBrands;
