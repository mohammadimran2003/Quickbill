import React from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  Chip,
  Stack,
} from "@mui/material";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import getDiscountAmount from "../../utils/getDiscountAmount";
import { formatCurrency } from "../../utils/formatCurrency";

const ProductCard = ({ product, onAddToCart }) => {
  const isOutOfStock = product.stock <= 0;

  const discountAmount = getDiscountAmount(
    product.discountType,
    product.discountValue,
    product.basePrice,
  );

  const finalPrice = product.basePrice - discountAmount;

  return (
    <Card
      elevation={2}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        transition: "transform 0.2s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 4,
        },
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          zIndex: 1,
        }}
      >
        <Chip
          label={isOutOfStock ? "Out of Stock" : `Stock: ${product.stock}`}
          color={
            isOutOfStock
              ? "error"
              : product.stock <= product.lowStockAlert
                ? "warning"
                : "success"
          }
          size="small"
          sx={{ fontWeight: "bold", fontSize: "0.7rem" }}
        />
      </Box>

      {/* Product Image */}
      <CardMedia
        component="img"
        height="140"
        image={
          product.images?.[0] || "https://placehold.co/200x200?text=No+Image"
        }
        alt={product.name}
        sx={{ objectFit: "cover", p: 1, bgcolor: "background.main" }}
      />

      {/* Product Details */}
      <CardContent sx={{ flexGrow: 1, p: 2, pb: 1 }}>
        <Typography
          variant="body2"
          color="text.secondary"
          gutterBottom
          sx={{ fontSize: "0.75rem" }}
        >
          SKU: {product.sku || "N/A"}
        </Typography>

        <Typography
          variant="subtitle1"
          fontWeight="bold"
          sx={{
            lineHeight: 1.2,
            mb: 1,

            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
            height: "2.4em",
          }}
        >
          {product.name}
        </Typography>

        <Stack direction="row" spacing={1} sx={{ alignItems: "flex-end" }}>
          <Typography
            variant="h6"
            color="primary.main"
            fontWeight="bold"
            sx={{ lineHeight: 1 }}
          >
            {formatCurrency(finalPrice)}
          </Typography>
          {product.discountValue > 0 && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ textDecoration: "line-through", lineHeight: 1.2 }}
            >
              {" "}
              {formatCurrency(product.basePrice)}
            </Typography>
          )}
        </Stack>
      </CardContent>

      {/* Action Area */}
      <Box sx={{ p: 1.5, pt: 0 }}>
        <Button
          fullWidth
          variant={isOutOfStock ? "outlined" : "contained"}
          color="primary"
          startIcon={<AddShoppingCartIcon />}
          onClick={() => onAddToCart(product)}
          disabled={isOutOfStock}
          disableElevation
          sx={{
            borderRadius: 1.5,
            textTransform: "none",
            fontWeight: "bold",
          }}
        >
          {isOutOfStock ? "Unavailable" : "Add to Cart"}
        </Button>
      </Box>
    </Card>
  );
};

export default ProductCard;
