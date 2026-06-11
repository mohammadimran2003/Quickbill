import { useState } from "react";
import { Box, Typography, IconButton, Divider } from "@mui/material";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import DiscountModal from "./DiscountModal.jsx";
import useCartStore from "../../store/cartStore.jsx";
import useFmt from "../../hooks/useFmt.js";

function CartSummary({ total, subTotal, discount }) {
  const [discountModal, setDiscountModal] = useState(false);
  const { discountValue, discountType } = useCartStore();

  const fmt = useFmt();

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
        <Typography variant="body2" color="text.secondary">
          Subtotal
        </Typography>
        <Typography variant="body2" fontWeight="bold">
          {fmt(subTotal)}
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 2,
          alignItems: "center",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Discount{" "}
            {discountValue > 0 &&
              `(${discountType === "PERCENT" ? `${discountValue}%` : `৳${discountValue}`})`}
          </Typography>
          <IconButton
            size="small"
            onClick={() => setDiscountModal(true)}
            color="primary"
            sx={{ p: 0.5 }}
          >
            <LocalOfferOutlinedIcon fontSize="small" />
          </IconButton>
        </Box>
        <Typography variant="body2" fontWeight="bold" color="success.main">
          {fmt(discount)}
        </Typography>
      </Box>
      <Divider sx={{ my: 1.5 }} />
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 2.5,
          alignItems: "center",
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          Total
        </Typography>
        <Typography variant="h5" fontWeight="bold" color="primary.main">
          {fmt(total)}
        </Typography>
      </Box>

      <DiscountModal
        open={discountModal}
        setOpen={() => setDiscountModal(false)}
      />
    </>
  );
}

export default CartSummary;
