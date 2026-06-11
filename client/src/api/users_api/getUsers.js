import api from "../axios.js";

const getUsers = async (params) => {
  const response = await api.get("/users", { params });

  return response.data;
};

export default getUsers;
