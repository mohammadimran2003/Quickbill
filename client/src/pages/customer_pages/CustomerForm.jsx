import {
  TextField,
  Button,
  FormControlLabel,
  Switch,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Box,
  FormHelperText,
  Typography,
  Paper,
  Divider,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { customerSchema } from "../../validations/customerValidation";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import createCustomer from "../../api/customers_api/createCustomer";
import { toast } from "sonner";

const CustomerForm = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      address: "",
      customerType: "REGULAR",
      creditLimit: 0,
      note: "",
      isActive: true,
    },
    resolver: zodResolver(customerSchema),
    mode: "onChange",
  });

  const { mutate, isPending } = useMutation({
    mutationFn: createCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      toast.success("Customer created successfully!");
      reset();
      navigate("/customers");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Something went wrong");
    },
  });

  const handleSave = (data) => {
    mutate(data);
  };

  const handleClose = () => {
    reset();
    navigate("/customers");
  };

  return (
    <Box
      sx={{
        maxWidth: 1000,
        mx: "auto",
        p: { xs: 2, md: 4 },
        color: "text.primary",
      }}
    >
      <Typography variant="h4" fontWeight={900} gutterBottom sx={{ mb: 3 }}>
        Add New Customer
      </Typography>

      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 4 },
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box
          component="form"
          sx={{ display: "flex", flexDirection: "column", gap: 3 }}
        >
          {/* Name and Phone Row */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 3,
            }}
          >
            <TextField
              {...register("name")}
              label="Customer Name"
              fullWidth
              variant="outlined"
              placeholder="Enter customer name"
              error={!!errors.name}
              helperText={errors.name?.message}
            />
            <TextField
              {...register("phone")}
              label="Phone Number"
              fullWidth
              variant="outlined"
              placeholder="Enter phone number"
              error={!!errors.phone}
              helperText={errors.phone?.message}
            />
          </Box>

          {/* Email and Credit Limit Row */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 3,
            }}
          >
            <TextField
              {...register("email")}
              label="Email"
              type="email"
              fullWidth
              variant="outlined"
              placeholder="Enter email address"
              error={!!errors.email}
              helperText={errors.email?.message}
            />
            <TextField
              {...register("creditLimit", {
                valueAsNumber: true,
              })}
              label="Credit Limit"
              type="number"
              fullWidth
              variant="outlined"
              error={!!errors.creditLimit}
              helperText={errors.creditLimit?.message}
              slotProps={{
                htmlInput: {
                  step: "0.01",
                  min: "0",
                },
              }}
              onFocus={(e) => {
                if (e.target.value === "0") {
                  e.target.select();
                }
              }}
            />
          </Box>

          {/* Customer Type */}
          <FormControl fullWidth error={!!errors.customerType}>
            <InputLabel>Customer Type</InputLabel>
            <Controller
              name="customerType"
              control={control}
              render={({ field }) => (
                <Select {...field} label="Customer Type">
                  <MenuItem value="REGULAR">Regular</MenuItem>
                  <MenuItem value="WHOLESALE">Wholesale</MenuItem>
                  <MenuItem value="VIP">VIP</MenuItem>
                </Select>
              )}
            />
            <FormHelperText>{errors.customerType?.message}</FormHelperText>
          </FormControl>

          {/* Address Field */}
          <TextField
            {...register("address")}
            label="Address"
            fullWidth
            variant="outlined"
            placeholder="Enter address"
            multiline
            rows={3}
          />

          {/* Note Field */}
          <TextField
            {...register("note")}
            label="Note"
            fullWidth
            variant="outlined"
            placeholder="Add a note"
            multiline
            rows={3}
          />

          <Divider sx={{ my: 1 }} />

          {/* Active Status */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <FormControlLabel
              control={
                <Controller
                  name="isActive"
                  control={control}
                  render={({ field }) => (
                    <Switch {...field} checked={field.value} color="primary" />
                  )}
                />
              }
              label={
                <Typography fontWeight={500} color="text.primary">
                  Active Status
                </Typography>
              }
            />

            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                onClick={handleClose}
                variant="outlined"
                color="inherit"
                size="large"
                sx={{ px: 4 }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit(handleSave)}
                variant="contained"
                color="primary"
                size="large"
                disabled={isPending}
                sx={{ px: 4 }}
              >
                {isPending ? "Saving..." : "Save Customer"}
              </Button>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default CustomerForm;
