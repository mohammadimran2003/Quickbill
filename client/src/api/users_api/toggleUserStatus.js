import api from "../axios.js";

export const toggleUserStatus = async (data) => {
  const response = await api.put(`/users/${data.userId}`, {
    isActive: data.isActive,
  });
  return response.data;
};
