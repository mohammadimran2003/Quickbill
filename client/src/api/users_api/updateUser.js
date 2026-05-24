import api from "../axios.js";

const updateUser = async (userData) => {
  const response = await api.put(`/users/${userData.id}`, userData);
  return response.data;
};

export default updateUser;
