const getStatusColor = (status) => {
  switch (status) {
    case "RECEIVED":
      return "success";
    case "ORDERED":
      return "warning";
    case "CANCELLED":
      return "error";
    default:
      return "default";
  }
};

export default getStatusColor;
