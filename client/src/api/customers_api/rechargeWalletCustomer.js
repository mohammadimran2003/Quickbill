import api from "../axios.js";

const rechargeWalletCustomer = async (id, walletRechargeData) => {
  const response = await api.put(
    `/customers/${id}/wallet/recharge`,
    walletRechargeData,
  );

  return response.data;
};

export default rechargeWalletCustomer;
