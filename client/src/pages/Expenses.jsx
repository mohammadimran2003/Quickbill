import ExpenseTable from "../components/expenses_comp/ExpenseTable";
import ExpenseModal from "../components/expenses_comp/ExpenseModal";
import PageHeader from "../components/shared/PageHeader";
import { Box } from "@mui/material";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import createExpense from "../api/expenses_api/createExpense";
import updateExpense from "../api/expenses_api/updateExpense";
import { toast } from "sonner";

function Expenses() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: createExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      handleModalClose();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Something went wrong");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateExpense(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      handleModalClose();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Something went wrong");
    },
  });

  const handleAddClick = () => {
    setSelectedExpense(null);
    setModalOpen(true);
  };

  const handleEditClick = (expense) => {
    setSelectedExpense(expense);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedExpense(null);
  };

  const handleSaveExpense = async (formData) => {
    const action = selectedExpense
      ? updateMutation.mutateAsync({ id: selectedExpense.id, data: formData })
      : createMutation.mutateAsync(formData);

    toast.promise(action, {
      loading: selectedExpense ? "Updating expense..." : "Saving expense...",
      success: selectedExpense
        ? "Expense updated successfully"
        : "Expense created successfully",
      error: (err) => err?.response?.data?.message || "Something went wrong",
    });
  };

  return (
    <Box sx={{ maxWidth: 1400, mx: "auto", p: 3 }}>
      <PageHeader
        title="Expenses"
        btnText="Add Expense"
        onBtnClick={handleAddClick}
      />

      <ExpenseTable onEditClick={handleEditClick} />
      <ExpenseModal
        open={modalOpen}
        onClose={handleModalClose}
        onSave={handleSaveExpense}
        initialData={selectedExpense}
      />
    </Box>
  );
}

export default Expenses;
