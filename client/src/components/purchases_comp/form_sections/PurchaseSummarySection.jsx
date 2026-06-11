import { Grid, Typography, Stack, Divider, TextField } from "@mui/material";
import FormSection from "./FormSection.jsx";
import usePurchaseStore from "../../../store/purchaseStore.js";

const PurchaseSummarySection = () => {
  const { total, dueAmount, paidAmount, setPaidAmount } = usePurchaseStore();

  return (
    <FormSection title="Summary & Payment">
      <Grid size={6}></Grid>
      <Grid size={6}>
        <Stack
          spacing={2}
          sx={{ bgcolor: "action.hover", p: 2, borderRadius: 1 }}
        >
          <Stack
            direction="row"
            sx={{ display: "flex", justifyContent: "space-between" }}
          >
            <Typography fontWeight={500}>Subtotal:</Typography>
            <Typography>{total.toFixed(2)}</Typography>
          </Stack>
          <Stack
            direction="row"
            sx={{ display: "flex", justifyContent: "space-between" }}
          >
            <Typography fontWeight={500}>Total:</Typography>
            <Typography>{total.toFixed(2)}</Typography>
          </Stack>
          <Divider />
          <Stack
            direction="row"
            sx={{ display: "flex", justifyContent: "space-between" }}
          >
            <Typography fontWeight={500}>Paid Amount:</Typography>
            <TextField
              type="number"
              size="small"
              value={paidAmount}
              onChange={(e) => setPaidAmount(parseFloat(e.target.value) || 0)}
              onFocus={(e) => e.target.select()}
              sx={{ width: 150 }}
              slotProps={{
                htmlInput: {
                  min: 0,
                  step: "0.01",
                },
              }}
            />
          </Stack>
          <Stack
            direction="row"
            sx={{ display: "flex", justifyContent: "space-between" }}
          >
            <Typography
              fontWeight={600}
              color={dueAmount > 0 ? "error.main" : "success.main"}
            >
              Due Amount:
            </Typography>
            <Typography
              fontWeight={600}
              color={dueAmount > 0 ? "error.main" : "success.main"}
            >
              {dueAmount.toFixed(2)}
            </Typography>
          </Stack>
          <Stack
            direction="row"
            sx={{ display: "flex", justifyContent: "space-between" }}
          >
            <Typography fontWeight={600}>Change Amount:</Typography>
            <Typography fontWeight={600}>
              {paidAmount > total ? (paidAmount - total).toFixed(2) : 0}
            </Typography>
          </Stack>
        </Stack>
      </Grid>
    </FormSection>
  );
};

export default PurchaseSummarySection;
