import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Brush,
} from "recharts";
import { Box, Paper, Typography, useTheme } from "@mui/material";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import ChartMenuSkeleton from "../shared/skeletons/ChartMenuSkeleton.jsx";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <Paper
        elevation={4}
        sx={{
          p: 1.5,
          borderRadius: 2,
          minWidth: 160,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography
          variant="caption"
          color="text.secondary"
          display="block"
          sx={{ mb: 0.5, fontWeight: 600 }}
        >
          {label}
        </Typography>
        {payload.map((entry) => (
          <Box
            key={entry.name}
            sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}
          >
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                bgcolor: entry.color,
              }}
            />
            <Typography variant="caption" color="text.secondary">
              {entry.name}:
            </Typography>
            <Typography variant="caption" fontWeight={700}>
              ৳ {Number(entry.value).toLocaleString()}
            </Typography>
          </Box>
        ))}
      </Paper>
    );
  }
  return null;
};

export default function ProfitVsRevenueChart({
  data = [],
  groupBy = "daily",
  isLoading,
}) {
  const theme = useTheme();

  if (isLoading) {
    return <ChartMenuSkeleton />;
  }

  const isEmpty = !data || data.length === 0;

  // Format x-axis labels based on groupBy
  const formatLabel = (dateStr) => {
    if (!dateStr) return "";
    if (groupBy === "monthly") {
      const [year, month] = dateStr.split("-");
      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      return `${monthNames[parseInt(month) - 1]} '${year.slice(2)}`;
    }
    if (groupBy === "weekly") {
      return `Wk ${dateStr.slice(5)}`;
    }
    // daily: show MM/DD
    return dateStr.slice(5).replace("-", "/");
  };

  const chartData = data.map((d) => ({
    ...d,
    label: formatLabel(d.date),
  }));

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
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: 2,
            bgcolor: "#E8F8F2",
            color: "#00A76F",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ShowChartIcon fontSize="small" />
        </Box>
        <Box>
          <Typography variant="subtitle1" fontWeight={700}>
            Profit vs. Revenue Trend
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Compare daily/weekly/monthly margins
          </Typography>
        </Box>
      </Box>

      {/* Chart */}
      {isEmpty ? (
        <Box
          sx={{
            height: 320,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            color: "text.disabled",
            gap: 1,
          }}
        >
          <ShowChartIcon sx={{ fontSize: 48, opacity: 0.3 }} />
          <Typography variant="body2" color="text.secondary">
            No data available to display trend chart
          </Typography>
        </Box>
      ) : (
        <ResponsiveContainer width="100%" height={320}>
          <LineChart
            data={chartData}
            margin={{ top: 10, right: 16, left: 8, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={theme.palette.divider}
              vertical={false}
            />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 12, fill: theme.palette.text.secondary }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: theme.palette.text.secondary }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) =>
                v >= 1000 ? `৳${(v / 1000).toFixed(0)}k` : `৳${v}`
              }
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: 13, paddingTop: 12 }}
            />
            <Line
              type="monotone"
              dataKey="revenue"
              name="Revenue"
              stroke="#00A76F"
              strokeWidth={3}
              activeDot={{ r: 6 }}
              dot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="profit"
              name="Profit"
              stroke="#FFAB00"
              strokeWidth={3}
              activeDot={{ r: 6 }}
              dot={{ r: 4 }}
            />

            {chartData.length > 15 && (
              <Brush
                dataKey="date"
                height={30}
                stroke="#8884d8"
                startIndex={chartData.length - 15}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      )}
    </Paper>
  );
}
