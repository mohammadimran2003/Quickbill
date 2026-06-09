import { Controller, useFormContext } from "react-hook-form";
import {
  Grid,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Autocomplete,
} from "@mui/material";
import FormSection from "./FormSection";

const PurchaseDetailsSection = ({ suppliersData }) => {
  const { control, register } = useFormContext();

  return (
    <FormSection title="Purchase Details">
      <Grid size={4}>
        <Controller
          name="supplierId"
          control={control}
          render={({ field, fieldState: { error } }) => {
            return (
              <Autocomplete
                {...field}
                options={suppliersData?.data || []}
                getOptionLabel={(option) => option.name || ""}
                isOptionEqualToValue={(option, value) =>
                  option.id === value?.id || option.id === value
                }
                onChange={(_, data) => field.onChange(data ? data.id : "")}
                onBlur={field.onBlur}
                value={
                  field.value
                    ? suppliersData?.data?.find((s) => s.id === field.value) ||
                      null
                    : ""
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Supplier"
                    variant="outlined"
                    size="small"
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />
            );
          }}
        />
      </Grid>
      <Grid size={4}>
        <FormControl fullWidth size="small">
          <InputLabel>Status</InputLabel>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Select {...field} label="Status">
                <MenuItem value="ORDERED">Ordered</MenuItem>
                <MenuItem value="RECEIVED">Received</MenuItem>
                <MenuItem value="CANCELLED">Cancelled</MenuItem>
              </Select>
            )}
          />
        </FormControl>
      </Grid>
      <Grid size={4}>
        <FormControl fullWidth size="small">
          <InputLabel>Payment Method</InputLabel>
          <Controller
            name="paymentMethod"
            control={control}
            render={({ field }) => (
              <Select {...field} label="Payment Method">
                <MenuItem value="CASH">Cash</MenuItem>
                <MenuItem value="CARD">Card</MenuItem>
                <MenuItem value="MOBILE_BANKING">Mobile Banking</MenuItem>
                <MenuItem value="UNPAID">Unpaid</MenuItem>
              </Select>
            )}
          />
        </FormControl>
      </Grid>
      <Grid size={12}>
        <TextField
          {...register("note")}
          label="Note"
          fullWidth
          variant="outlined"
          placeholder="Enter any additional note"
          multiline
          rows={2}
          size="small"
        />
      </Grid>
    </FormSection>
  );
};

export default PurchaseDetailsSection;
