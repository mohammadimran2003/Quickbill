import api from "../axios.js";

const getRecentOrders = async () => {
  try {
    const response = await api.get("/orders/recent-orders");
    return response.data;
  } catch (error) {
    console.error("Error fetching recent orders:", error);
    throw error;
  }
};

export default getRecentOrders;
