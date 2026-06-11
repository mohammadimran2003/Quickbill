import PageHeader from "../../components/shared/PageHeader.jsx";
import OrderTable from "../../components/orders_comp/OrderTable.jsx";
import { Box } from "@mui/material";

function Orders() {
  return (
    <Box>
      <PageHeader title="Orders" />
      <OrderTable />
    </Box>
  );
}

export default Orders;
