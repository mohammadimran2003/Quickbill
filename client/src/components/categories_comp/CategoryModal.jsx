import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { createCategorySchema } from "../../validations/categoryValidation.js";

const CategoryModal = ({ open, onClose, onSave, initialData = null }) => {
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
      description: "",
      image: "",
      isActive: true,
    },
    resolver: zodResolver(createCategorySchema),
    mode: "onChange",
  });

  useEffect(() => {
    if (open) {
      if (initialData) {
        reset({
          name: initialData.name || "",
          description: initialData.description || "",
          image: initialData.image || "",
          isActive:
            initialData.isActive !== undefined ? initialData.isActive : true,
        });
      } else {
        reset({
          name: "",
          description: "",
          image: "",
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
        {isEditMode ? "Edit Category" : "Add New Category"}
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
          label="Category Name"
          fullWidth
          variant="outlined"
          placeholder="Enter category name"
          error={!!errors.name}
          helperText={errors.name?.message}
          size="small"
          sx={{ mt: 1 }}
        />

        {/* Description Field */}
        <TextField
          {...register("description")}
          label="Description"
          fullWidth
          variant="outlined"
          placeholder="Enter category description"
          multiline
          rows={3}
          size="small"
        />

        {/* Image URL Field */}
        <TextField
          {...register("image")}
          label="Image URL"
          fullWidth
          variant="outlined"
          placeholder="Enter image URL (optional)"
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

export default CategoryModal;
