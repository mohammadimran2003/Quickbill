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
  console.log(isDirty, "is dirty");
  const currentValues = control._formValues; // বর্তমানে ইনপুটে যা আছে
  const baseValues = control._defaultValues; // রিঅ্যাক্ট হুক ফর্মের মেমোরিতে যে বেজলাইন আছে

  console.log("Current Form Values:", currentValues);
  console.log("Baseline (Default) Values:", baseValues);
  return (
    <Box sx={{ maxWidth: 900, mx: "auto", p: 3 }}>
      <Paper sx={{ p: 4, mt: 2 }}>
        <form onSubmit={handleSubmit(handleSave)} noValidate>
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
