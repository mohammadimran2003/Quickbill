import api from "../axios";

const getSalesPurchaseYearOverview = async () => {
  try {
    const response = await api.get("/dashboard/monthly-purchase-sales");
    return response.data;
  } catch (error) {
    console.error("Error fetching sales purchase year overview:", error);
    throw error;
  }
};

export default getSalesPurchaseYearOverview;
