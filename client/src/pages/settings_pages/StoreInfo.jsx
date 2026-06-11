import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Box, CircularProgress, Typography } from "@mui/material";
import { createStoreSchema } from "../../validations/storeValidation.js";
import { toast } from "sonner";
import StoreForm from "../../components/store_comp/StoreForm.jsx";
import getStore from "../../api/stores_api/getStore.js";
import updateStore from "../../api/stores_api/updateStore.js";
import { currencyOptions } from "../../constants/storeConstants.js";

const mapStoreToFormValues = (store) => ({
  name: store?.name || "",
  phone: store?.phone || "",
  email: store?.email || "",
  address: store?.address || "",
  logo: store?.logo || "",
  receiptFooter: store?.receiptFooter || "",
  binNumber: store?.binNumber || "",
  invoicePrefix: store?.invoicePrefix || "INV-",
  timeZone: store?.timeZone || "Asia/Dhaka",
  currency: store?.currency?.code || "৳",
  taxRate: store?.taxRate ?? 0,
});

function StoreInfo() {
  const queryClient = useQueryClient();

  // Store Query - Get store info
  const { data: storeData, isLoading: storeLoading } = useQuery({
    queryKey: ["store"],
    queryFn: getStore,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
    control,
  } = useForm({
    resolver: zodResolver(createStoreSchema),
    mode: "all",
    resetOptions: {
      keepDirtyValues: true,
    },
  });

  // Update Mutation
  const { mutateAsync: updateStoreMutation, isPending } = useMutation({
    mutationFn: (data) => updateStore(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["store"] });
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Failed to update store information",
      );
    },
  });

  useEffect(() => {
    if (storeData?.data) {
      reset(mapStoreToFormValues(storeData?.data));
    }
  }, [storeData]);

  const handleSave = (formData) => {
    console.log(formData, "formdata");

    const currencyData = currencyOptions.find(
      (option) => option.code === formData.currency,
    );

    const updatedFormData = {
      ...formData,
      currency: {
        code: currencyData.code,
        symbol: currencyData.symbol,
        name: currencyData.name,
      },
    };

    toast.promise(updateStoreMutation(updatedFormData), {
      loading: "Updating store information...",
      success: "Store information updated successfully",
      error: (error) =>
        error?.response?.data?.message || "Failed to update store information",
    });
  };

  if (storeLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1000, mx: "auto", color: "text.primary" }}>
      <Typography variant="h4" fontWeight={700} gutterBottom sx={{ mb: 1 }}>
        Store Information
      </Typography>
      <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
        Manage your store details and settings
      </Typography>

      <StoreForm
        register={register}
        errors={errors}
        control={control}
        handleSubmit={handleSubmit}
        handleSave={handleSave}
        isSubmitting={isSubmitting}
        reset={reset}
        isPending={isPending}
        isDirty={isDirty}
      />
    </Box>
  );
}

export default StoreInfo;
