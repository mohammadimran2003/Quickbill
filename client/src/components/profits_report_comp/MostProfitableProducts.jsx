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
  Chip,
  LinearProgress,
  Tooltip,
} from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

import TableSkeleton from "../shared/skeletons/TableSkeleton.jsx";
import useFmt from "../../hooks/useFmt.js";

const RANK_LABELS = [
  "🥇",
  "🥈",
  "🥉",
  "4th",
  "5th",
  "6th",
  "7th",
  "8th",
  "9th",
  "10th",
];

const MarginChip = ({ margin }) => {
  let color = "success";
  if (margin < 10) color = "error";
  else if (margin < 20) color = "warning";
  else if (margin < 35) color = "info";

  return (
    <Chip
      label={`${margin.toFixed(1)}%`}
      color={color}
      size="small"
      sx={{ fontWeight: 700, fontSize: "0.72rem", minWidth: 60 }}
    />
  );
};

export default function MostProfitableProducts({
  products = [],
  isLoading = false,
}) {
  const isEmpty = !products || products.length === 0;
  const fmt = useFmt();

  if (isLoading) {
    return <TableSkeleton />;
  }

  // Find max net profit to scale the linear progress bar
  const maxProfit = products.reduce((max, p) => Math.max(max, p.netProfit), 0);

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        boxShadow: "0px 4px 20px rgba(0,0,0,0.05)",
      }}
    >
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: 2,
            bgcolor: "#FFF8E1",
            color: "#FFAB00",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <EmojiEventsIcon fontSize="small" />
        </Box>
        <Box>
          <Typography variant="subtitle1" fontWeight={700}>
            Most Profitable Products
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Ranked by Net Profit — your real "profit mines"
          </Typography>
        </Box>
      </Box>

      {/* Empty State */}
      {isEmpty ? (
        <Box
          sx={{
            height: 200,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            color: "text.disabled",
            gap: 1,
          }}
        >
          <EmojiEventsIcon sx={{ fontSize: 48, opacity: 0.3 }} />
          <Typography variant="body2" color="text.secondary">
            No product data available for this period
          </Typography>
        </Box>
      ) : (
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow
                sx={{
                  "& th": {
                    fontWeight: 700,
                    fontSize: "0.75rem",
                    color: "text.secondary",
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                    borderBottom: "2px solid",
                    borderColor: "divider",
                    py: 1.5,
                  },
                }}
              >
                <TableCell sx={{ width: 40 }} align="center">
                  #
                </TableCell>
                <TableCell>Product Name</TableCell>
                <TableCell align="right">Qty Sold</TableCell>
                <TableCell align="right">Revenue</TableCell>
                <TableCell align="right">Cost</TableCell>
                <TableCell align="right">Net Profit</TableCell>
                <TableCell align="center">Margin %</TableCell>
                <TableCell sx={{ width: 120 }}>Profit Bar</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product, index) => {
                const progressVal =
                  maxProfit > 0
                    ? Math.round((product.netProfit / maxProfit) * 100)
                    : 0;

                const barColor =
                  index === 0
                    ? "#FFAB00"
                    : index === 1
                      ? "#00A76F"
                      : index === 2
                        ? "#0284C7"
                        : "#A78BFA";

                return (
                  <TableRow
                    key={product.productId}
                    sx={{
                      "&:hover": { bgcolor: "action.hover" },
                      "& td": { py: 1.4, borderColor: "divider" },
                      bgcolor:
                        index === 0 ? "rgba(255,171,0,0.04)" : "transparent",
                    }}
                  >
                    {/* Rank */}
                    <TableCell align="center">
                      <Typography fontSize="1rem">
                        {RANK_LABELS[index] ?? `${index + 1}th`}
                      </Typography>
                    </TableCell>

                    {/* Product Name */}
                    <TableCell>
                      <Tooltip title={product.name} placement="top-start">
                        <Typography
                          variant="body2"
                          fontWeight={index < 3 ? 700 : 500}
                          sx={{
                            maxWidth: 200,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {product.name}
                        </Typography>
                      </Tooltip>
                    </TableCell>

                    {/* Quantity Sold */}
                    <TableCell align="right">
                      <Typography variant="body2" fontWeight={600}>
                        {product.quantitySold.toLocaleString()}
                      </Typography>
                    </TableCell>

                    {/* Total Revenue */}
                    <TableCell align="right">
                      <Typography variant="body2">
                        {fmt(product.totalRevenue)}
                      </Typography>
                    </TableCell>

                    {/* Total Cost */}
                    <TableCell align="right">
                      <Typography variant="body2" color="text.secondary">
                        {fmt(product.totalCost)}
                      </Typography>
                    </TableCell>

                    {/* Net Profit */}
                    <TableCell align="right">
                      <Typography
                        variant="body2"
                        fontWeight={700}
                        sx={{
                          color: product.netProfit >= 0 ? "#00A76F" : "#FF5630",
                        }}
                      >
                        {fmt(product.netProfit)}
                      </Typography>
                    </TableCell>

                    {/* Margin Chip */}
                    <TableCell align="center">
                      <MarginChip margin={product.profitMargin} />
                    </TableCell>

                    {/* Progress Bar */}
                    <TableCell>
                      <Tooltip title={`${progressVal}% of top product`}>
                        <LinearProgress
                          variant="determinate"
                          value={progressVal}
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            bgcolor: "action.hover",
                            "& .MuiLinearProgress-bar": {
                              borderRadius: 4,
                              bgcolor: barColor,
                            },
                          }}
                        />
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Paper>
  );
}
