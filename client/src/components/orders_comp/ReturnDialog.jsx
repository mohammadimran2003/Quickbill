import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Slider,
} from "@mui/material";
import useFmt from "../../hooks/useFmt";

const ReturnDialog = ({ open, onClose, item, order, purchase, onConfirm }) => {
  const [quantity, setQuantity] = useState(1);
  const [reason, setReason] = useState("");

  const fmt = useFmt();

  const handleQuantityChange = (event, newValue) => {
    setQuantity(newValue);
  };

  const handleConfirm = () => {
    const returnData = {
      items: [
        {
          productId: item?.productId,
          quantity: quantity,
          price: order ? item?.unitPrice : item?.unitCost,
        },
      ],
      reason: reason || "No reason provided",
    };

    if (order) {
      returnData.orderId = order?.id;
      returnData.customerId = order?.customerId;
      returnData.items[0].orderItemId = item?.id;
    }

    if (purchase) {
      returnData.purchaseId = purchase?.id;
      returnData.supplierId = purchase?.supplierId;
      returnData.items[0].purchaseItemId = item?.id;
    }

    onConfirm(returnData);
    onClose();
    setQuantity(1);
    setReason("");
  };

  const handleClose = () => {
    onClose();
    setQuantity(1);
    setReason("");
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Return Product</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            {item?.productName}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Price: ৳{order ? item?.unitPrice : item?.unitCost} | Available to
            return: {item?.availableToReturn}
          </Typography>

          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Return Quantity: {quantity}
            </Typography>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Slider
                value={quantity === "" || isNaN(quantity) ? 1 : quantity}
                onChange={handleQuantityChange}
                min={1}
                max={item?.availableToReturn}
                valueLabelDisplay="auto"
                sx={{ mt: 1 }}
              />
              <TextField
                label="Quantity"
                type="number"
                value={quantity === "" || isNaN(quantity) ? "" : quantity}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "") {
                    setQuantity("");
                    return;
                  }

                  const parsed = parseInt(val, 10);
                  if (!isNaN(parsed)) {
                    if (parsed > item?.availableToReturn) {
                      setQuantity(item?.availableToReturn);
                    } else if (parsed < 1) {
                      setQuantity(1);
                    } else {
                      setQuantity(parsed);
                    }
                  }
                }}
                onBlur={() => {
                  if (quantity === "" || isNaN(quantity) || quantity < 1) {
                    setQuantity(1);
                  }
                }}
                inputProps={{ min: 1, max: item?.availableToReturn }}
                onFocus={(e) => e.target.select()}
                placeholder="1"
              />
            </Box>
          </Box>

          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Refund Amount:{" "}
              {fmt(quantity * (order ? item?.unitPrice : item?.unitCost))}
            </Typography>
          </Box>

          <Box sx={{ mt: 3 }}>
            <TextField
              fullWidth
              label="Reason for Return"
              multiline
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter reason for return..."
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" onClick={handleConfirm} color="primary">
          Confirm Return
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReturnDialog;
