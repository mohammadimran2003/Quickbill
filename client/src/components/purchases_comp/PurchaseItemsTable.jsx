import React from "react";
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
} from "@mui/material";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";

const PurchaseItemsTable = ({ purchase, onReturnItem }) => {
  return (
    <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2 }}>
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" fontWeight="bold">
          Purchase Items
        </Typography>
      </Box>
      <Table sx={{ minWidth: 650 }}>
        <TableHead sx={{ bgcolor: "background.neutral" }}>
          <TableRow>
            <TableCell sx={{ fontWeight: "bold" }}>Product Name</TableCell>
            <TableCell align="center" sx={{ fontWeight: "bold" }}>
              Unit Cost
            </TableCell>
            <TableCell align="center" sx={{ fontWeight: "bold" }}>
              Qty
            </TableCell>
            <TableCell align="center" sx={{ fontWeight: "bold" }}>
              Returned Qty
            </TableCell>
            <TableCell align="right" sx={{ fontWeight: "bold" }}>
              Total
            </TableCell>
            <TableCell align="center" sx={{ fontWeight: "bold" }}>
              Action
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {purchase?.items?.map((item) => (
            <TableRow key={item.id} hover>
              <TableCell>{item.productName}</TableCell>
              <TableCell align="center">${item.unitCost}</TableCell>
              <TableCell align="center">{item.quantity}</TableCell>
              <TableCell align="center">{item.returnedQty || 0}</TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                ${item.total}
              </TableCell>
              <TableCell align="center">
                <Tooltip title="Return Item">
                  <IconButton
                    color="primary"
                    size="small"
                    onClick={() => onReturnItem(item)}
                    disabled={item.availableToReturn <= 0}
                  >
                    <KeyboardReturnIcon />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PurchaseItemsTable;
