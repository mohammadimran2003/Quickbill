import PageHeader from "../../components/shared/PageHeader";
import CategoryTable from "../../components/categories_comp/CategoryTable";
import CategoryModal from "../../components/categories_comp/CategoryModal";
import { Box } from "@mui/material";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import createCategory from "../../api/categories_api/createCategory";
import updateCategory from "../../api/categories_api/updateCategory";
import { toast } from "sonner";

function Categories() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      handleModalClose();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Something went wrong");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      handleModalClose();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Something went wrong");
    },
  });

  const handleAddClick = () => {
    setSelectedCategory(null);
    setModalOpen(true);
  };

  const handleEditClick = (category) => {
    setSelectedCategory(category);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedCategory(null);
  };

  const handleSave = async (formData) => {
    const action = selectedCategory
      ? updateMutation.mutateAsync({ id: selectedCategory.id, data: formData })
      : createMutation.mutateAsync(formData);

    await toast.promise(action, {
      loading: selectedCategory ? "Updating category..." : "Saving category...",
      success: selectedCategory
        ? "Category updated successfully"
        : "Category created successfully",
      error: (err) => err?.response?.data?.message || "Something went wrong",
    });
  };

  return (
    <Box sx={{ mx: "auto", p: 3 }}>
      <PageHeader
        title="Categories"
        btnText="Add Category"
        onBtnClick={handleAddClick}
      />

      <CategoryTable onEditClick={handleEditClick} />
      <CategoryModal
        open={modalOpen}
        onClose={handleModalClose}
        onSave={handleSave}
        initialData={selectedCategory}
      />
    </Box>
  );
}

export default Categories;
