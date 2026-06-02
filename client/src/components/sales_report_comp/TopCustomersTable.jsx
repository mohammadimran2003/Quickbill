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
import fmt from "../../utils/fmt";

function TopCustomersTable({ customers }) {
  return (
    <TableContainer
      component={Paper}
      sx={{ p: 2, borderRadius: 2, height: "100%" }}
    >
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" fontWeight={700} color="primary.main">
          Top Customers
        </Typography>
      </Box>
      <Table size="small">
        <TableHead sx={{ bgcolor: "background.neutral" }}>
          <TableRow>
            <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
            <TableCell sx={{ fontWeight: 700 }} align="center">
              Phone
            </TableCell>
            <TableCell align="center" sx={{ fontWeight: 700 }}>
              Orders
            </TableCell>
            <TableCell align="right" sx={{ fontWeight: 700 }}>
              Total Spent
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {!customers || customers.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={3}
                align="center"
                sx={{ py: 3, color: "text.secondary" }}
              >
                No data available
              </TableCell>
            </TableRow>
          ) : (
            customers.map((row, i) => (
              <TableRow key={row.customerId || i}>
                <TableCell sx={{ fontWeight: 500 }}>{row.name}</TableCell>
                <TableCell align="center">
                  {row.phone ? row.phone : "N/A"}
                </TableCell>
                <TableCell align="center">{row.orders}</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>
                  {fmt(row.totalSpent)}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default TopCustomersTable;
