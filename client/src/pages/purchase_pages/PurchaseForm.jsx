import { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Box, Button, CircularProgress, Paper, Divider } from "@mui/material";
import { purchaseSchema } from "../../validations/purchaseValidation.js";
import createPurchase from "../../api/purchases_api/createPurchase.js";
import getPurchaseById from "../../api/purchases_api/getPurchaseById.js";
import updatePurchase from "../../api/purchases_api/updatePurchase.js";
import getSuppliers from "../../api/suppliers_api/getSuppliers.js";
import getProducts from "../../api/products_api/getProducts.js";
import { toast } from "sonner";
import PageHeader from "../../components/shared/PageHeader.jsx";
import PurchaseDetailsSection from "../../components/purchases_comp/form_sections/PurchaseDetailsSection.jsx";
import PurchaseItemsSection from "../../components/purchases_comp/form_sections/PurchaseItemsSection.jsx";
import PurchaseSummarySection from "../../components/purchases_comp/form_sections/PurchaseSummarySection.jsx";
import usePurchaseStore from "../../store/purchaseStore.js";

const defaultValues = {
  supplierId: "",
  status: "RECEIVED",
  note: "",
  paymentMethod: "CASH",
};

function PurchaseForm() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const {
    items,
    setPurchaseData,
    clearPurchase,
    subTotal,
    total,
    paidAmount,
    dueAmount,
  } = usePurchaseStore();

  const methods = useForm({
    defaultValues,
    resolver: zodResolver(purchaseSchema),
    mode: "all",
  });

  const { setValue, clearErrors } = methods;
  const prevItemsLength = useRef(0);

  useEffect(() => {
    setValue("items", items);
    setValue("subTotal", subTotal);
    setValue("total", total);
    setValue("paidAmount", paidAmount);
    setValue("dueAmount", dueAmount);

    // Clear error when items are added (like supplier field behavior)
    // Only clear when going from 0 to > 0 items
    if (prevItemsLength.current === 0 && items.length > 0) {
      clearErrors("items");
    }
    prevItemsLength.current = items.length;
  }, [items, subTotal, total, paidAmount, dueAmount, setValue, clearErrors]);

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  // Fetch Data
  const { data: purchaseData, isLoading: purchaseLoading } = useQuery({
    queryKey: ["purchase", id],
    queryFn: () => getPurchaseById(id),
    enabled: !!isEditMode,
  });

  const { data: suppliersData } = useQuery({
    queryKey: ["suppliers", "all"],
    queryFn: () => getSuppliers({ limit: 1000 }),
  });

  const { data: productsData } = useQuery({
    queryKey: ["products", "all"],
    queryFn: () => getProducts({ limit: 1000 }),
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: createPurchase,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchases"] });
      navigate("/purchases");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data) => updatePurchase(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchases"] });
      navigate("/purchases");
    },
  });

  useEffect(() => {
    if (purchaseData?.data) {
      const purchase = purchaseData.data;
      reset({
        supplierId: purchase.supplierId || "",
        status: purchase.status || "RECEIVED",
        note: purchase.note || "",
        paymentMethod: purchase.paymentMethod || "CASH",
      });
      setPurchaseData({
        items: purchase.items || [],
        subTotal: purchase.subTotal || 0,
        total: purchase.total || 0,
        paidAmount: purchase.paidAmount || 0,
        dueAmount: purchase.dueAmount || 0,
      });
    }
  }, [purchaseData, reset, setPurchaseData]);

  useEffect(() => {
    return () => {
      clearPurchase();
    };
  }, [clearPurchase]);

  const handleSave = (formData) => {
    const finalData = {
      ...formData,
      items,
      subTotal,
      total,
      paidAmount,
      dueAmount,
    };

    const action = isEditMode
      ? updateMutation.mutateAsync(finalData)
      : createMutation.mutateAsync(finalData);

    toast.promise(action, {
      loading: isEditMode ? "Updating purchase..." : "Creating purchase...",
      success: isEditMode
        ? "Purchase updated successfully"
        : "Purchase created successfully",
      error: (err) => err?.response?.data?.message || "Something went wrong",
    });
  };

  if (isEditMode && purchaseLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1000, mx: "auto", p: 3 }}>
      <PageHeader
        title={isEditMode ? "Edit Purchase" : "Create Purchase"}
        btnText="Back to Purchases"
        onBtnClick={() => navigate("/purchases")}
      />

      <Paper sx={{ p: 4, mt: 2 }}>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(handleSave)} noValidate>
            <PurchaseDetailsSection suppliersData={suppliersData} />

            <Divider sx={{ mb: 4 }} />

            <PurchaseItemsSection productsData={productsData} />

            <Divider sx={{ mb: 4 }} />

            <PurchaseSummarySection />

            {/* ========== FORM ACTIONS ========== */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 2,
                mt: 4,
              }}
            >
              <Button
                variant="outlined"
                color="inherit"
                onClick={() => navigate("/purchases")}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isSubmitting}
              >
                {isEditMode ? "Update Purchase" : "Create Purchase"}
              </Button>
            </Box>
          </form>
        </FormProvider>
      </Paper>
    </Box>
  );
}

export default PurchaseForm;
