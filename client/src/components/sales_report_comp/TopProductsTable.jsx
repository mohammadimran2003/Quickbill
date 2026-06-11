import React from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
} from "@mui/material";

import TableSkeleton from "../shared/skeletons/TableSkeleton.jsx";
import useFmt from "../../hooks/useFmt.js";

function TopProductsTable({ products, isLoading }) {
  const fmt = useFmt();
  if (isLoading) {
    return <TableSkeleton />;
  }

  return (
    <TableContainer
      component={Paper}
      sx={{ p: 2, borderRadius: 2, height: "100%" }}
    >
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" fontWeight={700} color="primary.main">
          Top Selling Products
        </Typography>
      </Box>
      <Table size="small">
        <TableHead sx={{ bgcolor: "background.neutral" }}>
          <TableRow>
            <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
            <TableCell align="right" sx={{ fontWeight: 700 }}>
              Qty Sold
            </TableCell>
            <TableCell align="right" sx={{ fontWeight: 700 }}>
              Revenue
            </TableCell>
            <TableCell align="right" sx={{ fontWeight: 700 }}>
              Profit
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {!products || products.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={4}
                align="center"
                sx={{ py: 3, color: "text.secondary" }}
              >
                No data available
              </TableCell>
            </TableRow>
          ) : (
            products.map((row, i) => (
              <TableRow key={row.productId || i}>
                <TableCell sx={{ fontWeight: 500 }}>{row.name}</TableCell>
                <TableCell align="right">{row.quantity}</TableCell>
                <TableCell align="right">{fmt(row.revenue)}</TableCell>
                <TableCell
                  align="right"
                  sx={{
                    color: row.profit >= 0 ? "success.main" : "error.main",
                    fontWeight: 600,
                  }}
                >
                  {fmt(row.profit)}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default TopProductsTable;
