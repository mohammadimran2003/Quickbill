import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Typography,
  Divider,
} from "@mui/material";
import { purchaseSchema } from "../../validations/purchaseValidation";
import createPurchase from "../../api/purchases_api/createPurchase";
import getPurchaseById from "../../api/purchases_api/getPurchaseById";
import updatePurchase from "../../api/purchases_api/updatePurchase";
import getSuppliers from "../../api/suppliers_api/getSuppliers";
import getProducts from "../../api/products_api/getProducts";
import { toast } from "sonner";
import PageHeader from "../../components/shared/PageHeader";
import PurchaseDetailsSection from "../../components/purchases_comp/form_sections/PurchaseDetailsSection";
import PurchaseItemsSection from "../../components/purchases_comp/form_sections/PurchaseItemsSection";
import PurchaseSummarySection from "../../components/purchases_comp/form_sections/PurchaseSummarySection";

const defaultValues = {
  supplierId: "",
  items: [],
  subTotal: 0,
  total: 0,
  paidAmount: 0,
  dueAmount: 0,
  status: "RECEIVED",
  note: "",
  paymentMethod: "CASH",
};

function PurchaseForm() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const methods = useForm({
    defaultValues,
    resolver: zodResolver(purchaseSchema),
    mode: "all",
  });

  const {
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { isSubmitting },
  } = methods;

  const items = watch("items");
  const paidAmount = watch("paidAmount");
  const total = watch("total");

  // Recalculate Subtotal, Total, and Due Amount
  useEffect(() => {
    const newSubTotal = items.reduce((acc, item) => acc + (item.total || 0), 0);
    setValue("subTotal", newSubTotal);
    setValue("total", newSubTotal);
  }, [items, setValue]);

  useEffect(() => {
    setValue("dueAmount", Math.max(0, total - (paidAmount || 0)));
  }, [total, paidAmount, setValue]);

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
        items: purchase.items || [],
        subTotal: purchase.subTotal || 0,
        total: purchase.total || 0,
        paidAmount: purchase.paidAmount || 0,
        dueAmount: purchase.dueAmount || 0,
        status: purchase.status || "RECEIVED",
        note: purchase.note || "",
        paymentMethod: purchase.paymentMethod || "CASH",
      });
    }
  }, [purchaseData, reset]);

  const handleSave = (formData) => {
    console.log(formData, "form data");

    const action = isEditMode
      ? updateMutation.mutateAsync(formData)
      : createMutation.mutateAsync(formData);

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
                disabled={isSubmitting || items.length === 0}
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
