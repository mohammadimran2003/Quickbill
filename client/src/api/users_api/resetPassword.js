import api from "../axios.js";

const resetPassword = async (userData) => {
  const response = await api.post(`/users/reset-password/${userData.id}`, {
    password: userData.password,
  });
  return response.data;
};

export default resetPassword;
