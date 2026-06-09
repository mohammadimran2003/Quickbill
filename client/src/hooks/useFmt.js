import { useQuery } from "@tanstack/react-query";
import getStore from "../api/stores_api/getStore";

const useFmt = () => {
  const { data } = useQuery({
    queryKey: ["store"],
    queryFn: getStore,
    staleTime: Infinity,
  });

  const currencySymbol = data?.data?.currency?.symbol || "৳";

  return (val) => {
    return currencySymbol + " " + Number(val).toLocaleString();
  };
};

export default useFmt;
