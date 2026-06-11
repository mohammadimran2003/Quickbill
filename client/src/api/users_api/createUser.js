import api from "../axios.js";

const createUser = async (userData) => {
  console.log(userData, "userData");

  const response = await api.post("/users", userData);
  return response.data;
};

export { createUser };
