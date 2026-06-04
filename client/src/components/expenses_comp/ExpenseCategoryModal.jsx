import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const expenseCategorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
});

const ExpenseCategoryModal = ({ open, onClose, onSave }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
    },
    resolver: zodResolver(expenseCategorySchema),
    mode: "onChange",
  });

  useEffect(() => {
    if (open) {
      reset({
        name: "",
      });
    }
  }, [open, reset]);

  const handleSave = (data) => {
    onSave(data);
    reset();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          fontWeight: 700,
          fontSize: "1.5rem",
          px: 3,
          py: 2,
        }}
      >
        Add Expense Category
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
          placeholder="Enter category name (e.g., Rent, Utilities, Salaries)"
          error={!!errors.name}
          helperText={errors.name?.message}
          size="small"
          sx={{ mt: 1 }}
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
          Add Category
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ExpenseCategoryModal;
