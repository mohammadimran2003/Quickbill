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
  LinearProgress,
  Box,
  Tooltip,
} from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import TableSkeleton from "../shared/skeletons/TableSkeleton";

const TopLowStockTable = ({ topLowStockProducts, isLoading }) => {
  if (isLoading) {
    return <TableSkeleton rows={2} cols={5} />;
  }

  if (!topLowStockProducts || topLowStockProducts.length === 0) {
    return (
      <Paper
        sx={{
          p: 3,
          textAlign: "center",
          borderRadius: 2,
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography color="text.secondary">
          Have not any low stock product.
        </Typography>
      </Paper>
    );
  }

  return (
    <TableContainer
      component={Paper}
      sx={{
        borderRadius: 2,
        boxShadow: 2,
        height: "100%",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          p: 2,
          bgcolor: "error.lighter",
          display: "flex",
          alignItems: "center",
          gap: 1,
          borderBottom: "1px solid",
          borderColor: "error.light",
        }}
      >
        <WarningAmberIcon color="error" fontSize="small" />
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: "bold", color: "error.main" }}
        >
          Top Low Stock Alert
        </Typography>
      </Box>

      <Table size="small" aria-label="top low stock table">
        <TableHead sx={{ bgcolor: "background.neutral" }}>
          <TableRow>
            <TableCell sx={{ fontWeight: "bold", py: 1.5 }}>Product</TableCell>
            <TableCell align="center" sx={{ fontWeight: "bold", py: 1.5 }}>
              Current Stock
            </TableCell>
            <TableCell align="center" sx={{ fontWeight: "bold", py: 1.5 }}>
              Alert Limit
            </TableCell>
            <TableCell
              align="left"
              sx={{ fontWeight: "bold", py: 1.5, width: "30%" }}
            >
              Stock Status
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {topLowStockProducts.slice(0, 5).map((product) => {
            const stock = product.stock || 0;
            const alertLimit = product.lowStockAlert || 5;

            // progress barer percentage ber korar logic
            const progressValue =
              alertLimit > 0 ? Math.min((stock / alertLimit) * 100, 100) : 0;

            return (
              <TableRow
                key={product.id}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  "&:hover": { bgcolor: "action.hover" },
                }}
              >
                <TableCell
                  component="th"
                  scope="row"
                  sx={{ fontWeight: "medium", py: 1.5 }}
                >
                  {product.name}
                </TableCell>

                <TableCell
                  align="center"
                  sx={{ fontWeight: "bold", color: "error.main", py: 1.5 }}
                >
                  {stock}
                </TableCell>

                <TableCell
                  align="center"
                  sx={{ color: "text.secondary", py: 1.5 }}
                >
                  {alertLimit}
                </TableCell>

                <TableCell align="left" sx={{ py: 1.5 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      width: "100%",
                    }}
                  >
                    <Tooltip
                      title={`${Math.round(progressValue)}% of limit remaining`}
                      placement="top"
                      arrow
                    >
                      <Box sx={{ width: "100%", mr: 1 }}>
                        <LinearProgress
                          variant="determinate"
                          value={
                            progressValue === 0 && stock > 0
                              ? 10
                              : progressValue
                          }
                          color={progressValue <= 30 ? "error" : "warning"}
                          sx={{ height: 6, borderRadius: 5 }}
                        />
                      </Box>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TopLowStockTable;
