import {
  Grid,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { Controller } from "react-hook-form";
import FormSection from "../shared/FormSection";
import {
  timeZoneOptions,
  currencyOptions,
} from "../../constants/storeConstants";

const RegionalSettingsSection = ({ register, control }) => {
  return (
    <FormSection title="Regional Settings">
      <Grid size={6}>
        <FormControl fullWidth size="small">
          <InputLabel>Time Zone</InputLabel>
          <Controller
            name="timeZone"
            control={control}
            render={({ field: { onChange, value, ref, ...field } }) => (
              <Select
                {...field}
                inputRef={ref}
                value={value ?? ""}
                onChange={(e) => onChange(e.target.value)}
                label="Time Zone"
              >
                {timeZoneOptions.map((tz) => (
                  <MenuItem key={tz} value={tz}>
                    {tz}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
        </FormControl>
      </Grid>

      <Grid size={6}>
        <FormControl fullWidth size="small">
          <InputLabel>Currency</InputLabel>
          <Controller
            name="currency"
            control={control}
            render={({ field: { onChange, value, ref, ...field } }) => (
              <Select
                {...field}
                inputRef={ref}
                value={value ?? ""}
                onChange={(e) => onChange(e.target.value)}
                label="Currency"
              >
                {currencyOptions.map((curr) => (
                  <MenuItem key={curr.value} value={curr.value}>
                    {curr.label}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
        </FormControl>
      </Grid>

      <Grid size={6}>
        <TextField
          {...register("taxRate", { valueAsNumber: true })}
          label="Tax Rate (%)"
          fullWidth
          variant="outlined"
          type="number"
          placeholder="Enter tax rate"
          slotProps={{
            inputProps: { min: 0, step: 0.1 },
          }}
          size="small"
        />
      </Grid>
    </FormSection>
  );
};

export default RegionalSettingsSection;
