import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Chip,
  Box,
} from "@mui/material";

const StockReportTable = ({ stockDetails }) => {
  if (!stockDetails || stockDetails.length === 0) {
    return (
      <Paper sx={{ p: 3, textAlign: "center", borderRadius: 2 }}>
        <Typography color="text.secondary">Stock not Available</Typography>
      </Paper>
    );
  }

  return (
    <TableContainer
      component={Paper}
      sx={{ borderRadius: 2, boxShadow: 2, overflow: "hidden" }}
    >
      <Typography variant="subtitle1" sx={{ fontWeight: "bold", padding: 2 }}>
        Stock Report
      </Typography>

      <Table sx={{ minWidth: 650 }} aria-label="stock report table">
        <TableHead sx={{ bgcolor: "background.neutral" }}>
          <TableRow>
            <TableCell sx={{ fontWeight: "bold" }}>Product Name</TableCell>
            <TableCell align="right" sx={{ fontWeight: "bold" }}>
              Opening Stock
            </TableCell>
            <TableCell
              align="right"
              sx={{ fontWeight: "bold", color: "success.main" }}
            >
              Stock In
            </TableCell>
            <TableCell
              align="right"
              sx={{ fontWeight: "bold", color: "error.main" }}
            >
              Stock Out
            </TableCell>
            <TableCell align="center" sx={{ fontWeight: "bold" }}>
              Current Stock
            </TableCell>
            <TableCell align="center" sx={{ fontWeight: "bold" }}>
              Low Stock Alert
            </TableCell>
            <TableCell align="right" sx={{ fontWeight: "bold" }}>
              Cost Price
            </TableCell>
            <TableCell align="right" sx={{ fontWeight: "bold" }}>
              Total Value
            </TableCell>
            <TableCell align="center" sx={{ fontWeight: "bold" }}>
              Status
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {stockDetails.map((product) => {
            const currentStock = product.currentStock || 0;
            const costPrice = product.costPrice || 0;

            const totalValue = currentStock > 0 ? currentStock * costPrice : 0;

            return (
              <TableRow
                key={product.productId}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  "&:hover": { bgcolor: "action.hover" },
                }}
              >
                <TableCell
                  component="th"
                  scope="row"
                  sx={{ fontWeight: "medium" }}
                >
                  {product.name}
                </TableCell>

                <TableCell align="right">{product.openingStock}</TableCell>

                <TableCell align="right" sx={{ color: "success.dark" }}>
                  +{product.stockIn}
                </TableCell>

                <TableCell align="right" sx={{ color: "error.dark" }}>
                  -{product.stockOut}
                </TableCell>

                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  {currentStock}
                </TableCell>

                <TableCell align="center">
                  {product.lowStockAlert.toLocaleString()}
                </TableCell>

                <TableCell align="right">
                  ৳{costPrice.toLocaleString()}
                </TableCell>

                <TableCell align="right" sx={{ fontWeight: "bold" }}>
                  ৳{totalValue.toLocaleString()}
                </TableCell>

                <TableCell align="center">
                  {currentStock <= 0 ? (
                    <Chip
                      label="Out of Stock"
                      color="error"
                      size="small"
                      variant="filled"
                      sx={{ fontWeight: "bold" }}
                    />
                  ) : currentStock <= (product.lowStockAlert || 5) ? (
                    <Chip
                      label="Low Stock"
                      color="warning"
                      size="small"
                      variant="filled"
                      sx={{
                        fontWeight: "bold",
                        bgcolor: "warning.main",
                        color: "white",
                      }}
                    />
                  ) : (
                    <Chip
                      label="In Stock"
                      color="success"
                      size="small"
                      variant="outlined"
                      sx={{ fontWeight: "medium" }}
                    />
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default StockReportTable;
