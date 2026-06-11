import { useFormContext } from "react-hook-form";
import { Grid, TextField } from "@mui/material";
import FormSection from "./FormSection.jsx";

const InventorySection = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <FormSection title="Inventory Management">
      <Grid size={4}>
        <TextField
          {...register("stock", { valueAsNumber: true })}
          label="Current Stock"
          type="number"
          onFocus={(event) => {
            if (event.target.value === "0") {
              event.target.select();
            }
          }}
          fullWidth
          variant="outlined"
          error={!!errors.stock}
          helperText={errors.stock?.message}
          size="small"
          placeholder="0"
        />
      </Grid>

      <Grid size={8}>
        <TextField
          {...register("lowStockAlert", { valueAsNumber: true })}
          label="Low Stock Alert Threshold"
          type="number"
          fullWidth
          onFocus={(event) => {
            if (event.target.value === "0") {
              event.target.select();
            }
          }}
          variant="outlined"
          error={!!errors.lowStockAlert}
          helperText={
            errors.lowStockAlert?.message ||
            "Alert will trigger when stock falls below this value"
          }
          size="small"
          placeholder="5"
        />
      </Grid>
    </FormSection>
  );
};

export default InventorySection;
