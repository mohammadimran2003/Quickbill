import api from "../axios.js";

const getLast30DaysSales = async () => {
  try {
    const response = await api.get("/orders/last-30-days");
    return response.data;
  } catch (err) {
    console.log(err, "get last 30 days sales err");
    throw err;
  }
};

export default getLast30DaysSales;
