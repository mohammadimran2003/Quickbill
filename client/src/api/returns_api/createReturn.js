import axios from "../axios.js";

const createReturn = async (returnData) => {
  const response = await axios.post("/return", returnData);
  return response.data;
};

export default createReturn;
