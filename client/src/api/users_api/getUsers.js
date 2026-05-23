import api from "../axios";

const getUsers = async (params) => {
  const response = await api.get("/auth/users", { params });

  return response.data;
};

export default getUsers;
