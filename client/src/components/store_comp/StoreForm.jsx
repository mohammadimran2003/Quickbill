import { Box, Button, Paper } from "@mui/material";
import BasicInformationSection from "./BasicInformationSection";
import InvoiceSettingsSection from "./InvoiceSettingsSection";
import RegionalSettingsSection from "./RegionalSettingsSection";

const StoreForm = ({
  register,
  errors,
  control,
  handleSubmit,
  handleSave,
  isSubmitting,
  reset,
  isPending,
  isDirty,
}) => {
  return (
    <Box>
      <Paper sx={{ p: 4, mt: 2 }}>
        <form onSubmit={handleSubmit(handleSave)}>
          <BasicInformationSection register={register} errors={errors} />
          <InvoiceSettingsSection register={register} />
          <RegionalSettingsSection register={register} control={control} />

          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 2,
              mt: 4,
            }}
          >
            <Button
              variant="outlined"
              color="inherit"
              onClick={() => reset()}
              disabled={isSubmitting}
            >
              Reset
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isSubmitting || isPending || !isDirty}
            >
              {isSubmitting || isPending ? "Saving..." : "Save Changes"}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default StoreForm;
