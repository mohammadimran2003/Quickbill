import { Button, Stack, TextField, Typography, Box } from "@mui/material";
import useFmt from "../../hooks/useFmt";

const paymentMethods = ["CASH", "CARD", "MOBILE_BANKING", "UNPAID"];

function CartCheckout({
  paymentMethod,
  setPaymentMethod,
  amountPaid,
  setAmountPaid,
  changeAmount,
  selectedCustomer,
}) {
  const fmt = useFmt();

  return (
    <>
      {/* Payment Methods */}
      <Stack
        direction="row"
        spacing={1}
        sx={{
          mb: 2,
          overflowX: "auto",
          whiteSpace: "nowrap",
          pb: 1,
          gap: 1,
        }}
      >
        {paymentMethods.map((method) => (
          <Button
            key={method}
            variant={paymentMethod === method ? "contained" : "outlined"}
            onClick={() => setPaymentMethod(method)}
            size="small"
            sx={{
              flexShrink: 0,
              fontSize: "0.75rem",
              py: 0.5,
              px: 2,
            }}
            disabled={
              paymentMethod === "UNPAID" &&
              selectedCustomer?.name === "Walk-in Customer"
            }
          >
            {method.replace("_", " ")}
          </Button>
        ))}
      </Stack>

      {/* Paid & Change */}
      {paymentMethod !== "UNPAID" && (
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <TextField
            label="Paid Amount"
            type="number"
            size="small"
            value={amountPaid}
            onChange={(e) => setAmountPaid(e.target.value)}
            sx={{ flexGrow: 1 }}
          />
          <Box sx={{ minWidth: "80px", textAlign: "right" }}>
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
            >
              Change
            </Typography>
            <Typography
              variant="subtitle1"
              fontWeight="bold"
              color={changeAmount > 0 ? "success.main" : "text.primary"}
            >
              {fmt(changeAmount)}
            </Typography>
          </Box>
        </Box>
      )}
    </>
  );
}

export default CartCheckout;
