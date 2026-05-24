import api from "../axios";

const createUser = async (userData) => {
  const response = await api.post("/users", userData);
  return response.data;
};

export { createUser };
