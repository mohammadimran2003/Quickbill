import { Grid, TextField } from "@mui/material";
import FormSection from "../shared/FormSection.jsx";

const InvoiceSettingsSection = ({ register }) => {
  return (
    <FormSection title="Invoice Settings">
      <Grid size={6}>
        <TextField
          {...register("invoicePrefix")}
          label="Invoice Prefix"
          fullWidth
          variant="outlined"
          placeholder="e.g., INV-"
          size="small"
        />
      </Grid>

      <Grid size={6}>
        <TextField
          {...register("binNumber")}
          label="BIN Number"
          fullWidth
          variant="outlined"
          placeholder="Enter BIN number (optional)"
          size="small"
        />
      </Grid>

      <Grid size={12}>
        <TextField
          {...register("receiptFooter")}
          label="Receipt Footer"
          fullWidth
          variant="outlined"
          placeholder="Enter receipt footer text (optional)"
          multiline
          rows={2}
          size="small"
        />
      </Grid>
    </FormSection>
  );
};

export default InvoiceSettingsSection;
