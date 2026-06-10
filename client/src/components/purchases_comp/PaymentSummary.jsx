import { Grid, Paper, Typography, Divider, Stack } from "@mui/material";

function PaymentSummary({ subTotal, total, paidAmount, dueAmount, createdAt }) {
  return (
    <Grid size={{ xs: 12, md: 6 }}>
      <Paper sx={{ p: 3, height: "100%" }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
          Payment Summary
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <Stack spacing={2}>
          <Stack
            direction="row"
            sx={{ display: "flex", justifyContent: "space-between" }}
          >
            <Typography color="text.secondary">Subtotal</Typography>
            <Typography fontWeight={500}>${subTotal?.toFixed(2)}</Typography>
          </Stack>
          <Stack
            direction="row"
            sx={{ display: "flex", justifyContent: "space-between" }}
          >
            <Typography color="text.secondary">Total</Typography>
            <Typography fontWeight={600} variant="subtitle1">
              ${total?.toFixed(2)}
            </Typography>
          </Stack>
          <Divider />
          <Stack
            direction="row"
            sx={{ display: "flex", justifyContent: "space-between" }}
          >
            <Typography color="text.secondary">Paid Amount</Typography>
            <Typography fontWeight={500} color="success.main">
              ${paidAmount?.toFixed(2)}
            </Typography>
          </Stack>
          <Stack
            direction="row"
            sx={{ display: "flex", justifyContent: "space-between" }}
          >
            <Typography color="text.secondary">Due Amount</Typography>
            <Typography
              fontWeight={600}
              color={dueAmount > 0 ? "error.main" : "success.main"}
            >
              ${dueAmount?.toFixed(2)}
            </Typography>
          </Stack>
        </Stack>

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ mt: 3, display: "block" }}
        >
          Created At: {new Date(createdAt).toLocaleString()}
        </Typography>
      </Paper>
    </Grid>
  );
}

export default PaymentSummary;
