import { Stack, Paper, Typography, Box, Divider, Chip } from "@mui/material";
import PaymentIcon from "@mui/icons-material/Payment";
import PersonIcon from "@mui/icons-material/Person";
import useFmt from "../../hooks/useFmt.js";

const OrderSummary = ({ order }) => {
  const fmt = useFmt();
  return (
    <Stack spacing={3}>
      {/* Summary Card */}
      <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Summary
        </Typography>
        <Stack spacing={1.5}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography color="text.secondary">Subtotal</Typography>
            <Typography fontWeight="medium">{order?.subtotal}</Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography color="text.secondary">
              Discount ({order?.discountType})
            </Typography>
            <Typography color="error.main">
              - {fmt(order?.discountAmount)}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography color="text.secondary">Tax</Typography>
            <Typography>+ {fmt(order?.taxAmount)}</Typography>
          </Box>
          <Divider />
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="h6" fontWeight="bold">
              Total
            </Typography>
            <Typography variant="h6" fontWeight="bold" color="primary">
              {fmt(order?.total)}
            </Typography>
          </Box>
        </Stack>
      </Paper>

      {/* Payment Status Card */}
      <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
        <Stack direction="row" spacing={1} mb={2}>
          <PaymentIcon color="action" />
          <Typography variant="h6" fontWeight="bold">
            Payment Details
          </Typography>
        </Stack>
        <Stack spacing={1.5}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography color="text.secondary">Method</Typography>
            <Chip
              label={order?.paymentMethod}
              size="small"
              variant="outlined"
            />
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography color="text.secondary">Paid Amount</Typography>
            <Typography color="success.main" fontWeight="bold">
              {fmt(order?.amountPaid)}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography color="text.secondary">Due Amount</Typography>
            <Typography
              color={order?.dueAmount > 0 ? "error.main" : "text.primary"}
            >
              {fmt(order?.dueAmount)}
            </Typography>
          </Box>
          {order?.changeAmount > 0 && (
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography color="text.secondary">Change</Typography>
              <Typography>{fmt(order?.changeAmount)}</Typography>
            </Box>
          )}
        </Stack>
      </Paper>

      {/* Customer Info Card */}
      <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
        <Stack direction="row" spacing={1} mb={2}>
          <PersonIcon color="action" />
          <Typography variant="h6" fontWeight="bold">
            Customer Info
          </Typography>
        </Stack>
        <Typography variant="body1" fontWeight="medium">
          {order?.customerName || "Walk-in Customer"}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          ID: {order?.customerId || "N/A"}
        </Typography>
      </Paper>
    </Stack>
  );
};

export default OrderSummary;
