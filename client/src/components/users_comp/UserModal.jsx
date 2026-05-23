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
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { createUserSchema } from "../../validations/userValidation";

const UserModal = ({ open, onClose, onSave, initialData = null }) => {
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
      email: "",
      password: "",
      confirmPassword: "",
      role: "SALESMAN",
      isActive: true,
      phone: "",
      address: "",
      photo: "",
    },
    resolver: zodResolver(createUserSchema),
    mode: "onChange",
  });

  useEffect(() => {
    if (open) {
      if (initialData) {
        reset({
          name: initialData.name || "",
          email: initialData.email || "",
          password: "",
          confirmPassword: "",
          role: initialData.role || "SALESMAN",
          isActive:
            initialData.isActive !== undefined ? initialData.isActive : true,
          phone: initialData.phone || "",
          address: initialData.address || "",
          photo: initialData.photo || "",
        });
      } else {
        reset({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
          role: "SALESMAN",
          isActive: true,
          phone: "",
          address: "",
          photo: "",
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
        {isEditMode ? "Edit User" : "Add New User"}
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
        {/* Name Field */}
        <TextField
          {...register("name")}
          label="Full Name *"
          fullWidth
          variant="outlined"
          placeholder="Enter full name"
          error={!!errors.name}
          helperText={errors.name?.message}
          size="small"
          sx={{ mt: 1 }}
        />

        {/* Email Field */}
        <TextField
          {...register("email")}
          label="Email *"
          fullWidth
          variant="outlined"
          placeholder="Enter email address"
          error={!!errors.email}
          helperText={errors.email?.message}
          size="small"
        />

        {/* Password Field */}
        {!isEditMode && (
          <TextField
            {...register("password")}
            label="Password *"
            fullWidth
            variant="outlined"
            placeholder="Enter password"
            type="password"
            error={!!errors.password}
            helperText={errors.password?.message}
            size="small"
          />
        )}

        {/* Confirm Password Field */}
        {!isEditMode && (
          <TextField
            {...register("confirmPassword")}
            label="Confirm Password"
            fullWidth
            variant="outlined"
            placeholder="Confirm password"
            type="password"
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
            size="small"
          />
        )}

        {/* Role Field */}
        <FormControl fullWidth size="small">
          <InputLabel id="role-label">Role *</InputLabel>
          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                labelId="role-label"
                label="Role *"
                error={!!errors.role}
              >
                <MenuItem value="ADMIN">Admin</MenuItem>
                <MenuItem value="MANAGER">Manager</MenuItem>
                <MenuItem value="SALESMAN">Salesman</MenuItem>
              </Select>
            )}
          />
        </FormControl>

        {/* Phone Field */}
        <TextField
          {...register("phone")}
          label="Phone Number (optional)"
          fullWidth
          variant="outlined"
          placeholder="Enter phone number (e.g., 01712345678)"
          error={!!errors.phone}
          helperText={errors.phone?.message}
          size="small"
        />

        {/* Address Field */}
        <TextField
          {...register("address")}
          label="Address (optional)"
          fullWidth
          variant="outlined"
          placeholder="Enter address"
          multiline
          rows={2}
          size="small"
        />

        {/* Photo URL Field */}
        <TextField
          {...register("photo")}
          label="Photo URL (optional)"
          fullWidth
          variant="outlined"
          placeholder="Enter photo URL"
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

export default UserModal;
