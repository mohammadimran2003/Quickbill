import { useFormContext, Controller, useWatch } from "react-hook-form";
import { Grid, TextField, MenuItem } from "@mui/material";
import FormSection from "./FormSection.jsx";

const PricingDiscountSection = () => {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext();

  const discountType = useWatch({
    control,
    name: "discountType",
    defaultValue: "NONE",
  });

  const isDiscountValueDisabled = !discountType || discountType === "NONE";

  return (
    <FormSection title="Pricing & Discount">
      <Grid size={3}>
        <TextField
          {...register("costPrice", { valueAsNumber: true })}
          label="Cost Price"
          type="number"
          fullWidth
          onFocus={(event) => {
            if (event.target.value === "0") {
              event.target.select();
            }
          }}
          variant="outlined"
          error={!!errors.costPrice}
          helperText={errors.costPrice?.message}
          size="small"
          placeholder="0.00"
        />
      </Grid>

      <Grid size={3}>
        <TextField
          {...register("basePrice", { valueAsNumber: true })}
          label="Base Price"
          type="number"
          fullWidth
          onFocus={(event) => {
            if (event.target.value === "0") {
              event.target.select();
            }
          }}
          variant="outlined"
          error={!!errors.basePrice}
          helperText={errors.basePrice?.message}
          size="small"
          placeholder="0.00"
        />
      </Grid>

      <Grid size={3}>
        <TextField
          {...register("taxRate", { valueAsNumber: true })}
          label="Tax Rate (%)"
          type="number"
          fullWidth
          onFocus={(event) => {
            if (event.target.value === "0") {
              event.target.select();
            }
          }}
          variant="outlined"
          error={!!errors.taxRate}
          helperText={errors.taxRate?.message}
          size="small"
          placeholder="0.00"
        />
      </Grid>

      <Grid size={3}>
        <Controller
          name="unit"
          control={control}
          render={({ field }) => (
            <TextField
              select
              label="Unit"
              fullWidth
              variant="outlined"
              size="small"
              {...field}
            >
              <MenuItem value="PCS">PCS</MenuItem>
              <MenuItem value="KG">KG</MenuItem>
              <MenuItem value="GRAM">GRAM</MenuItem>
              <MenuItem value="LITRE">LITRE</MenuItem>
              <MenuItem value="DOZEN">DOZEN</MenuItem>
              <MenuItem value="METER">METER</MenuItem>
              <MenuItem value="BOX">BOX</MenuItem>
            </TextField>
          )}
        />
      </Grid>

      <Grid size={4}>
        <Controller
          name="discountType"
          control={control}
          render={({ field }) => (
            <TextField
              select
              label="Discount Type"
              fullWidth
              variant="outlined"
              size="small"
              {...field}
              value={field.value ?? ""}
              onChange={(event) =>
                field.onChange(event.target.value || undefined)
              }
            >
              <MenuItem value="NONE">No Discount</MenuItem>
              <MenuItem value="FLAT">Flat Amount</MenuItem>
              <MenuItem value="PERCENTAGE">Percentage</MenuItem>
            </TextField>
          )}
        />
      </Grid>

      <Grid size={8}>
        <TextField
          {...register("discountValue", { valueAsNumber: true })}
          label="Discount Value"
          type="number"
          disabled={isDiscountValueDisabled}
          fullWidth
          defaultValue={0}
          variant="outlined"
          error={!!errors.discountValue}
          helperText={errors.discountValue?.message}
          size="small"
          placeholder="0.00"
        />
      </Grid>
    </FormSection>
  );
};

export default PricingDiscountSection;
