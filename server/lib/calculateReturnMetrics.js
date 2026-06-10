const calculateReturnMetrics = (returnData) => {
  const returnedQuantities = {};

  returnData?.returns?.forEach((ret) => {
    ret.items.forEach((item) => {
      returnedQuantities[item.productId] =
        (returnedQuantities[item.productId] || 0) + item.quantity;
    });
  });

  return returnData?.items?.map((item) => {
    const totalAlreadyReturned = returnedQuantities[item.productId] || 0;

    const basicAvailable = Math.max(0, item.quantity - totalAlreadyReturned);

    const availableToReturn =
      returnData.status === "RECEIVED"
        ? Math.min(basicAvailable, item.product?.stock || 0)
        : basicAvailable;

    return {
      ...item,
      totalAlreadyReturned,
      availableToReturn,
    };
  });
};

export default calculateReturnMetrics;
