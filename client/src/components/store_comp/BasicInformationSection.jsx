import { Grid, TextField } from "@mui/material";
import FormSection from "../shared/FormSection";

const BasicInformationSection = ({ register, errors }) => {
  return (
    <FormSection title="Basic Information">
      <Grid size={12}>
        <TextField
          {...register("name")}
          label="Store Name"
          fullWidth
          variant="outlined"
          placeholder="Enter store name"
          error={!!errors.name}
          helperText={errors.name?.message}
          size="small"
        />
      </Grid>

      <Grid size={12}>
        <TextField
          {...register("address")}
          label="Address"
          fullWidth
          variant="outlined"
          placeholder="Enter store address"
          multiline
          rows={2}
          size="small"
        />
      </Grid>

      <Grid size={6}>
        <TextField
          {...register("phone")}
          label="Phone Number"
          fullWidth
          variant="outlined"
          placeholder="Enter phone number"
          size="small"
        />
      </Grid>

      <Grid size={6}>
        <TextField
          {...register("email")}
          label="Email"
          fullWidth
          variant="outlined"
          placeholder="Enter email address"
          error={!!errors.email}
          helperText={errors.email?.message}
          size="small"
        />
      </Grid>

      <Grid size={12}>
        <TextField
          {...register("logo")}
          label="Logo URL"
          fullWidth
          variant="outlined"
          placeholder="Enter logo URL (optional)"
          size="small"
        />
      </Grid>
    </FormSection>
  );
};

export default BasicInformationSection;
