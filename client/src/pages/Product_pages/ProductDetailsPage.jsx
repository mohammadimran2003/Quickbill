import {
  Box,
  Typography,
  Grid,
  Paper,
  Divider,
  Chip,
  Stack,
  Card,
  CardMedia,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";
import {
  Inventory as InventoryIcon,
  Label as LabelIcon,
  BarChart as BarChartIcon,
  Category as CategoryIcon,
  BrandingWatermark as BrandIcon,
} from "@mui/icons-material";
import { useQuery } from "@tanstack/react-query";
import getProductById from "../../api/products_api/getProductById.js";
import ProductDetailHeader from "../../components/products_comp/ProductDetailHeader.jsx";
import { Suspense } from "react";
import ProductDetailSkeleton from "../../components/shared/skeletons/ProductDetailSkeleton.jsx";
import { useParams } from "react-router-dom";

const ProductDetailsPage = () => {
  const params = useParams();
  const { id } = params;

  const { data, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: () => getProductById(id),
  });

  const { data: product } = data || {};
  if (isLoading) {
    return <ProductDetailSkeleton />;
  }

  // Discounted Price Calculation
  const calculateFinalPrice = () => {
    if (!product.discountType || !product.discountValue)
      return product.basePrice;
    if (product.discountType === "PERCENTAGE") {
      return (
        product.basePrice - (product.basePrice * product.discountValue) / 100
      );
    }
    return product.basePrice - product.discountValue;
  };

  const finalPrice = calculateFinalPrice();

  return (
    <Box>
      {/* Header Area */}
      <ProductDetailHeader product={product} />

      <Suspense fallback={<ProductDetailSkeleton />}>
        <Grid
          container
          spacing={3}
          sx={{
            mt: 4,
          }}
        >
          {/* Left: Images & Quick Stats */}
          <Grid size={4}>
            <Card sx={{ mb: 3, borderRadius: 2 }}>
              <CardMedia
                component="img"
                height="400"
                image={
                  product.images?.[0] ||
                  "https://via.placeholder.com/400x400?text=No+Image"
                }
                alt={product.name}
                sx={{ objectFit: "contain", bgcolor: "#f5f5f5" }}
              />
            </Card>

            <Paper sx={{ p: 2, borderRadius: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Pricing Summary
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Stack spacing={1.5}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography color="text.secondary">Cost Price:</Typography>
                  <Typography fontWeight="500">৳{product.costPrice}</Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography color="text.secondary">Base Price:</Typography>
                  <Typography
                    sx={{
                      textDecoration: product.discountValue
                        ? "line-through"
                        : "none",
                    }}
                  >
                    ৳{product.basePrice}
                  </Typography>
                </Box>
                {product.discountValue > 0 && (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      color: "error.main",
                    }}
                  >
                    <Typography>Discount ({product.discountType}):</Typography>
                    <Typography>
                      -{product.discountValue}
                      {product.discountType === "PERCENTAGE" ? "%" : "৳"}
                    </Typography>
                  </Box>
                )}
                <Divider />
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography fontWeight="bold">
                    Final Selling Price:
                  </Typography>
                  <Typography
                    variant="h6"
                    color="primary.main"
                    fontWeight="bold"
                  >
                    ৳{finalPrice}
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Grid>

          {/* Right: Detailed Info */}
          <Grid size={8}>
            <Paper sx={{ p: 3, borderRadius: 2, mb: 3 }}>
              <Typography variant="h6" gutterBottom color="primary">
                Product Specifications
              </Typography>
              <TableContainer sx={{ width: "100%" }}>
                <Table size="small">
                  <TableBody>
                    <TableRow>
                      <TableCell sx={{ fontWeight: "bold", width: "40%" }}>
                        <CategoryIcon
                          fontSize="small"
                          sx={{ mr: 1, verticalAlign: "middle" }}
                        />{" "}
                        Category
                      </TableCell>
                      <TableCell>
                        {product.category?.name || "Uncategorized"}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        <BrandIcon
                          fontSize="small"
                          sx={{ mr: 1, verticalAlign: "middle" }}
                        />{" "}
                        Brand
                      </TableCell>
                      <TableCell>{product.brand?.name || "N/A"}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        <BarChartIcon
                          fontSize="small"
                          sx={{ mr: 1, verticalAlign: "middle" }}
                        />{" "}
                        Barcode / SKU
                      </TableCell>
                      <TableCell>
                        {product.barcode || "N/A"} / {product.sku || "N/A"}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        <InventoryIcon
                          fontSize="small"
                          sx={{ mr: 1, verticalAlign: "middle" }}
                        />{" "}
                        Stock Status
                      </TableCell>
                      <TableCell>
                        <Typography
                          color={
                            product.stock > product.lowStockAlert
                              ? "success.main"
                              : "error.main"
                          }
                          fontWeight="bold"
                        >
                          {product.stock} {product.unit} (Alert at{" "}
                          {product.lowStockAlert})
                        </Typography>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Tax Rate
                      </TableCell>
                      <TableCell>{product.taxRate}%</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>

            <Paper sx={{ p: 3, borderRadius: 2, mb: 3 }}>
              <Typography variant="h6" gutterBottom color="primary">
                Description
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {product.description ||
                  "No description available for this product."}
              </Typography>
            </Paper>

            <Paper sx={{ p: 3, borderRadius: 2, mb: 3 }}>
              <Typography variant="h6" gutterBottom color="primary">
                Tags & Metadata
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {product.tags?.length > 0 ? (
                  product.tags.map((tag, index) => (
                    <Chip
                      key={index}
                      label={tag}
                      icon={<LabelIcon />}
                      size="small"
                    />
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No tags added.
                  </Typography>
                )}
              </Box>
            </Paper>

            <Paper sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom color="primary">
                Barcode
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {product.barcodeImage ? (
                  <img
                    src={product.barcodeImage}
                    alt="Barcode"
                    style={{ maxWidth: "200px", height: "auto" }}
                  />
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No barcode image available.
                  </Typography>
                )}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Suspense>
    </Box>
  );
};

export default ProductDetailsPage;
