import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Paper,
  Typography,
} from "@mui/material";

import productsSchema from "../../validations/productValidations";
import getCategories from "../../api/categories_api/getCategories";
import getBrands from "../../api/brands_api/getBrands";
import createProduct from "../../api/products_api/createProduct";
import updateProduct from "../../api/products_api/updateProduct";
import getProductById from "../../api/products_api/getProductById";
import { toast } from "sonner";

import BasicInfoSection from "../../components/products_comp/form_sections/BasicInfoSection";
import CategoryTypeSection from "../../components/products_comp/form_sections/CategoryTypeSection";
import PricingDiscountSection from "../../components/products_comp/form_sections/PricingDiscountSection";
import InventorySection from "../../components/products_comp/form_sections/InventorySection";
import MediaMetadataSection from "../../components/products_comp/form_sections/MediaMetadataSection";
import StatusSection from "../../components/products_comp/form_sections/StatusSection";

const defaultValues = {
  name: "",
  description: "",
  images: [],
  barcode: "",
  sku: "",
  productType: "SIMPLE",
  categoryId: "",
  brandId: "",
  costPrice: 0,
  basePrice: 0,
  discountType: undefined,
  discountValue: undefined,
  stock: 0,
  lowStockAlert: 5,
  unit: "PCS",
  taxRate: 0,
  isActive: true,
  tags: [],
};

function ProductForm() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const methods = useForm({
    defaultValues,
    resolver: zodResolver(productsSchema),
    mode: "all",
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  // 1. Categories Query
  const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories({}),
    staleTime: 1000 * 60,
  });

  // 2. Brands Query
  const { data: brandsData, isLoading: brandsLoading } = useQuery({
    queryKey: ["brands"],
    queryFn: () => getBrands({}),
    staleTime: 1000 * 60,
  });

  // 3. Product by ID Query (Edit Mode)
  const { data: productData, isLoading: productLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(id),
    enabled: !!isEditMode,
  });

  // 4. Create Mutation
  const createMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      navigate("/products");
    },
  });

  // 5. Update Mutation
  const updateMutation = useMutation({
    mutationFn: (data) => updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      navigate("/products");
    },
  });

  useEffect(() => {
    if (productData?.data) {
      const product = productData.data;
      reset({
        name: product.name || "",
        description: product.description || "",
        images: product.images || [],
        barcode: product.barcode || "",
        sku: product.sku || "",
        productType: product.productType || "SIMPLE",
        categoryId: product.categoryId || "",
        brandId: product.brandId || "",
        costPrice: product.costPrice ?? 0,
        basePrice: product.basePrice ?? 0,
        discountType: product.discountType ?? "NONE",
        discountValue: product.discountValue ?? 0,
        stock: product.stock ?? 0,
        lowStockAlert: product.lowStockAlert ?? 5,
        unit: product.unit || "PCS",
        taxRate: product.taxRate ?? 0,
        isActive: product.isActive ?? true,
        tags: product.tags || [],
      });
    }
  }, [productData, reset]);

  const handleSave = (formData) => {
    const payload = {
      ...formData,
      images: formData.images || [],
      tags: formData.tags || [],
    };

    const action = isEditMode
      ? updateMutation.mutateAsync(payload)
      : createMutation.mutateAsync(payload);

    toast.promise(action, {
      loading: isEditMode ? "Updating product..." : "Creating product...",
      success: isEditMode
        ? "Product updated successfully"
        : "Product created successfully",
      error: (err) => err?.response?.data?.message || "Something went wrong",
    });
  };

  if (isEditMode && productLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ color: "text.primary" }}>
      <Typography variant="h4" fontWeight={700} gutterBottom sx={{ mb: 1 }}>
        {isEditMode ? "Edit Product" : "Create Product"}
      </Typography>
      <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
        {isEditMode
          ? "Update product details and pricing information"
          : "Add a new product to your inventory"}
      </Typography>

      <Paper sx={{ p: 4, mt: 2 }}>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(handleSave)} noValidate>
            <BasicInfoSection />
            <Divider sx={{ my: 1 }} />

            <CategoryTypeSection
              categoriesData={categoriesData}
              brandsData={brandsData}
            />
            <Divider sx={{ my: 1 }} />

            <PricingDiscountSection />
            <Divider sx={{ my: 1 }} />

            <InventorySection />
            <Divider sx={{ my: 1 }} />

            <MediaMetadataSection />
            <Divider sx={{ my: 1 }} />

            <StatusSection />

            {/* ========== ACTION BUTTONS ========== */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 2,
                mt: 4,
                pt: 2,
                borderTop: "1px solid #e0e0e0",
              }}
            >
              <Button variant="outlined" onClick={() => navigate("/products")}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isSubmitting || categoriesLoading || brandsLoading}
              >
                {isEditMode ? "Update Product" : "Create Product"}
              </Button>
            </Box>
          </form>
        </FormProvider>
      </Paper>
    </Box>
  );
}

export default ProductForm;
