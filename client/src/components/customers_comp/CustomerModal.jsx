import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
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
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { customerSchema } from "../../validations/customerValidation.js";

const CustomerModal = ({ open, onClose, onSave, initialData = null }) => {
  const isEditMode = !!initialData;

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

  useEffect(() => {
    if (open) {
      if (initialData) {
        reset({
          name: initialData.name || "",
          phone: initialData.phone || "",
          email: initialData.email || "",
          address: initialData.address || "",
          customerType: initialData.customerType || "REGULAR",
          creditLimit: initialData.creditLimit || 0,
          note: initialData.note || "",
          isActive:
            initialData.isActive !== undefined ? initialData.isActive : true,
        });
      } else {
        reset({
          name: "",
          phone: "",
          email: "",
          address: "",
          customerType: "REGULAR",
          creditLimit: 0,
          note: "",
          isActive: true,
        });
      }
    }
  }, [initialData, open, reset]);

  const handleSave = (data) => {
    onSave(data);
    reset();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: 2,
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          fontWeight: 700,
          fontSize: "1.5rem",
          px: 3,
          py: 2,
        }}
      >
        {isEditMode ? "Edit Customer" : "Add New Customer"}
      </DialogTitle>

      <DialogContent
        sx={{
          px: 3,
          py: 4,
          display: "flex",
          flexDirection: "column",
          gap: 2.5,
        }}
        component="form"
      >
        {/* Name and Phone Row */}
        <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
          <TextField
            {...register("name")}
            label="Customer Name"
            fullWidth
            variant="outlined"
            placeholder="Enter customer name"
            error={!!errors.name}
            helperText={errors.name?.message}
            size="small"
          />
          <TextField
            {...register("phone")}
            label="Phone Number"
            fullWidth
            variant="outlined"
            placeholder="Enter phone number"
            error={!!errors.phone}
            helperText={errors.phone?.message}
            size="small"
          />
        </Box>

        {/* Email and Credit Limit Row */}
        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            {...register("email")}
            label="Email"
            type="email"
            fullWidth
            variant="outlined"
            placeholder="Enter email address"
            error={!!errors.email}
            helperText={errors.email?.message}
            size="small"
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
            size="small"
            // Latest MUI way
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
        <FormControl fullWidth size="small" error={!!errors.customerType}>
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
          {/* Ei line-ti add korun error message dekhar jonno */}
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
          rows={2}
          size="small"
        />

        {/* Note Field */}
        <TextField
          {...register("note")}
          label="Note"
          fullWidth
          variant="outlined"
          placeholder="Add a note"
          multiline
          rows={2}
          size="small"
        />

        {/* Active Status */}
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
          label="Active"
        />
      </DialogContent>

      <DialogActions
        sx={{
          gap: 1,
          p: 2,
        }}
      >
        <Button onClick={handleClose} variant="outlined" color="inherit">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit(handleSave)}
          variant="contained"
          color="primary"
        >
          {isEditMode ? "Update" : "Add"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CustomerModal;
