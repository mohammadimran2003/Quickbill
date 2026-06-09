import api from "../axios";

export const registerUser = async (userData) => {
  try {
    const response = await api.post("/auth/register", userData);
    return response.data;
  } catch (error) {
    // Backend theke pathano message-ta eikhane thake
    const message = error.response?.data?.message || "Registration failed";
    throw new Error(message, { cause: error });
  }
};

export default registerUser;
