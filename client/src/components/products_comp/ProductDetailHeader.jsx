import {
  Stack,
  Box,
  IconButton,
  Chip,
  Button,
  Typography,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
} from "@mui/icons-material";

function ProductDetailHeader({ product }) {
  return (
    <Stack
      direction="row"
      sx={{
        mb: 3,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Stack direction="row" spacing={2}>
        <Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <IconButton onClick={() => navigate(-1)} sx={{ mt: 0.5 }}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              {product.name}
            </Typography>
          </Box>
          <Stack direction="row" spacing={1}>
            <Chip
              label={product.productType}
              color="primary"
              size="small"
              variant="outlined"
            />
            <Chip
              label={product.isActive ? "Active" : "Inactive"}
              color={product.isActive ? "success" : "error"}
              size="small"
            />
            {product.stock <= product.lowStockAlert && (
              <Chip label="Low Stock" color="warning" size="small" />
            )}
          </Stack>
        </Box>
      </Stack>
      <Button
        variant="contained"
        startIcon={<EditIcon />}
        onClick={() => navigate(`/products/edit-products/${product.id}`)}
      >
        Edit Product
      </Button>
    </Stack>
  );
}

export default ProductDetailHeader;
