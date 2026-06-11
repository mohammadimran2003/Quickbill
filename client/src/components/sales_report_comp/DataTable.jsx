import React from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import TableSkeleton from "../shared/skeletons/TableSkeleton.jsx";
import useFmt from "../../hooks/useFmt.js";

function DataTable({ chartData, isLoading }) {
  const fmt = useFmt();
  if (isLoading) {
    return <TableSkeleton />;
  }

  return (
    <Box
      sx={{
        p: 2,
        bgcolor: "background.paper",
        borderRadius: 2,
        boxShadow: 1,
        mt: 4,
      }}
    >
      <Typography variant="h6">Sales overview</Typography>
      {chartData.length > 0 && (
        <TableContainer sx={{ mt: 4, borderRadius: 2 }}>
          <Table size="small">
            <TableHead sx={{ bgcolor: "background.neutral" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>
                  Revenue
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>
                  Profit
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>
                  Orders
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>
                  Cash
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>
                  Card
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>
                  Mobile Banking
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {chartData.map((row, i) => (
                <TableRow key={row.date}>
                  <TableCell>{row.date}</TableCell>
                  <TableCell align="right">{fmt(row.revenue)}</TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      color: row.profit >= 0 ? "success.main" : "error.main",
                    }}
                  >
                    {fmt(row.profit)}
                  </TableCell>
                  <TableCell align="right">{row.orders}</TableCell>
                  <TableCell align="right">
                    {fmt(row.paymentBreakdown.CASH)}
                  </TableCell>
                  <TableCell align="right">
                    {fmt(row.paymentBreakdown.CARD)}
                  </TableCell>
                  <TableCell align="right">
                    {fmt(row.paymentBreakdown.MOBILE_BANKING)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}

export default DataTable;
