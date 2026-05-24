import { Box, Typography } from "@mui/material";
import InventoryIcon from "@mui/icons-material/Inventory";

function ProductNotFound() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "40vh",
        width: "100%",
        textAlign: "center",
        p: 3,
        color: "text.secondary",
      }}
    >
      <InventoryIcon
        sx={{
          fontSize: 60,
          mb: 2,
          color: "action.disabled",
        }}
      />

      <Typography
        variant="h6"
        fontWeight="600"
        color="text.primary"
        gutterBottom
      >
        No Products Found
      </Typography>

      <Typography variant="body2" sx={{ maxWidth: 300 }}>
        We couldn't find any products matching your current search or filters.
        Try adjusting them!
      </Typography>
    </Box>
  );
}

export default ProductNotFound;
