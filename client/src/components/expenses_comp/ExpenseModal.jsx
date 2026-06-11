import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  IconButton,
  Box,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import getExpenseCategories from "../../api/expenses_api/getExpenseCategories.js";
import createExpenseCategory from "../../api/expenses_api/createExpenseCategory.js";
import AddIcon from "@mui/icons-material/Add";
import { toast } from "sonner";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { createExpenseSchema } from "../../validations/expenseValidations.js";

const ExpenseModal = ({ open, onClose, onSave, initialData = null }) => {
  const isEditMode = !!initialData;
  const [showCategoryInput, setShowCategoryInput] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  const queryClient = useQueryClient();

  const { data: categoriesData } = useQuery({
    queryKey: ["expense-categories"],
    queryFn: getExpenseCategories,
  });

  const createCategoryMutation = useMutation({
    mutationFn: createExpenseCategory,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["expense-categories"] });
      setShowCategoryInput(false);
      setNewCategoryName("");
      toast.success("Category created successfully");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Something went wrong");
    },
  });

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      amount: 0,
      date: dayjs(),
      categoryId: "",
      paymentMethod: "CASH",
      note: "",
      referenceId: "",
    },
    resolver: zodResolver(createExpenseSchema),
    mode: "onChange",
  });

  useEffect(() => {
    if (open) {
      if (initialData) {
        reset({
          title: initialData.title || "",
          amount: initialData.amount || 0,
          date: initialData.date ? dayjs(initialData.date) : dayjs(),
          categoryId: initialData.categoryId || "",
          paymentMethod: initialData.paymentMethod || "CASH",
          note: initialData.note || "",
          referenceId: initialData.referenceId || "",
        });
      } else {
        reset({
          title: "",
          amount: 0,
          date: dayjs(),
          categoryId: "",
          paymentMethod: "CASH",
          note: "",
          referenceId: "",
        });
      }
    }
  }, [initialData, open, reset]);

  const handleSave = (data) => {
    const formattedData = {
      ...data,
      date: data.date
        ? new Date(data.date).toISOString()
        : new Date().toISOString(),
    };
    onSave(formattedData);
    reset();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
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
          {isEditMode ? "Edit Expense" : "Add New Expense"}
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
          {/* Title Field */}
          <TextField
            {...register("title")}
            label="Title"
            fullWidth
            variant="outlined"
            placeholder="Enter expense title"
            error={!!errors.title}
            helperText={errors.title?.message}
            size="small"
            sx={{ mt: 1 }}
          />

          {/* Amount Field */}
          <TextField
            {...register("amount")}
            label="Amount"
            type="number"
            fullWidth
            variant="outlined"
            placeholder="Enter amount"
            error={!!errors.amount}
            helperText={errors.amount?.message}
            size="small"
          />

          {/* Date Field */}
          <Controller
            name="date"
            control={control}
            render={({ field }) => (
              <DatePicker
                {...field}
                label="Date"
                slotProps={{
                  textField: {
                    size: "small",
                    fullWidth: true,
                    error: !!errors.date,
                    helperText: errors.date?.message,
                  },
                }}
              />
            )}
          />

          {/* Category Field */}
          <Box sx={{ display: "flex", gap: 1, alignItems: "flex-start" }}>
            <FormControl fullWidth size="small" error={!!errors.categoryId}>
              <InputLabel>Category</InputLabel>
              <Controller
                name="categoryId"
                control={control}
                render={({ field }) => (
                  <Select {...field} label="Category">
                    {categoriesData?.data?.map((cat) => (
                      <MenuItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </FormControl>
            <IconButton
              onClick={() => setShowCategoryInput(!showCategoryInput)}
              color="primary"
              sx={{ mt: 0.5 }}
              title="Add new category"
            >
              <AddIcon />
            </IconButton>
          </Box>

          {showCategoryInput && (
            <Box sx={{ display: "flex", gap: 1, alignItems: "flex-start" }}>
              <TextField
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                label="New Category Name"
                fullWidth
                variant="outlined"
                placeholder="Enter category name"
                size="small"
                autoFocus
              />
              <Button
                onClick={() =>
                  createCategoryMutation.mutate({ name: newCategoryName })
                }
                variant="contained"
                color="primary"
                disabled={
                  !newCategoryName.trim() || createCategoryMutation.isPending
                }
                sx={{ mt: 0.5 }}
              >
                Add
              </Button>
              <Button
                onClick={() => {
                  setShowCategoryInput(false);
                  setNewCategoryName("");
                }}
                variant="outlined"
                color="inherit"
                sx={{ mt: 0.5 }}
              >
                Cancel
              </Button>
            </Box>
          )}

          {/* Payment Method Field */}
          <FormControl fullWidth size="small" error={!!errors.paymentMethod}>
            <InputLabel>Payment Method</InputLabel>
            <Controller
              name="paymentMethod"
              control={control}
              render={({ field }) => (
                <Select {...field} label="Payment Method">
                  <MenuItem value="CASH">Cash</MenuItem>
                  <MenuItem value="MOBILE_BANKING">Mobile Banking</MenuItem>
                  <MenuItem value="BANK_TRANSFER">Bank Transfer</MenuItem>
                  <MenuItem value="OTHER">Other</MenuItem>
                </Select>
              )}
            />
          </FormControl>

          {/* Note Field */}
          <TextField
            {...register("note")}
            label="Note"
            fullWidth
            variant="outlined"
            placeholder="Enter note (optional)"
            multiline
            rows={2}
            size="small"
          />

          {/* Reference ID Field */}
          <TextField
            {...register("referenceId")}
            label="Reference ID"
            fullWidth
            variant="outlined"
            placeholder="Enter reference ID (optional)"
            size="small"
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
    </LocalizationProvider>
  );
};

export default ExpenseModal;
