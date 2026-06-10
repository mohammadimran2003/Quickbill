import { Box, Button, Typography } from "@mui/material";
import { useState } from "react";
import CustomerTable from "../../components/customers_comp/CustomerTable";
import CustomerModal from "../../components/customers_comp/CustomerModal";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import createCustomer from "../../api/customers_api/createCustomer";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import updateCustomer from "../../api/customers_api/updateCustomer";
import PageHeader from "../../components/shared/PageHeader";

function Customers() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: createCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      handleModalClose();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Something went wrong");
    },
  });

  const { mutate: updateMutate } = useMutation({
    mutationFn: ({ id, data }) => updateCustomer({ id, data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      handleModalClose();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Something went wrong");
    },
  });

  const handleAddClick = () => {
    setSelectedCustomer(null);
    setModalOpen(true);
  };

  const handleEditClick = (customer) => {
    setSelectedCustomer(customer);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedCustomer(null);
  };

  const handleSave = (formData) => {
    if (selectedCustomer) {
      // edit mode
      toast.promise(updateMutate({ id: selectedCustomer.id, data: formData }), {
        loading: "Updating customer...",
        success: "Customer updated successfully!",
        error: (err) => err.response?.data?.message || "Something went wrong",
      });
    } else {
      // add mode
      toast.promise(mutate(formData), {
        loading: "Saving customer...",
        success: "Customer created successfully!",
        error: (err) => err.response?.data?.message || "Something went wrong",
      });
    }
  };

  return (
    <Box>
      <PageHeader title="Customer" btnText="Add" onBtnClick={handleAddClick} />

      <CustomerTable onEditClick={handleEditClick} />
      <CustomerModal
        open={modalOpen}
        onClose={handleModalClose}
        onSave={handleSave}
        initialData={selectedCustomer}
      />
    </Box>
  );
}

export default Customers;
