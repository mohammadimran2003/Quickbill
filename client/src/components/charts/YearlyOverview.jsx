import React from "react";
import {
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ComposedChart,
} from "recharts";
import { Box, Typography, useTheme } from "@mui/material";
import getSalesPurchaseYearOverview from "../../api/dashboard_api/getSalesPurchaseYearOverview";
import { useQuery } from "@tanstack/react-query";

function YearlyOverview() {
  const theme = useTheme();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["monthlyPurchaseSales"],
    queryFn: () => getSalesPurchaseYearOverview(),
  });

  const chartData = data?.data || yearlyData;

  if (isLoading) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography>Loading yearly data...</Typography>
      </Box>
    );
  }

  if (isError) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography color="error">Failed to load yearly data</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", height: 350 }}>
      <ComposedChart
        width="100%"
        height={350}
        data={chartData}
        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
      >
        <CartesianGrid
          vertical={false}
          strokeDasharray="3 3"
          stroke="#f0f0f0"
        />
        <XAxis
          dataKey="month"
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#9e9e9e", fontSize: 12 }}
          dy={10}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#9e9e9e", fontSize: 12 }}
        />
        <Tooltip
          contentStyle={{
            borderRadius: "8px",
            border: "none",
            boxShadow: "0px 4px 20px rgba(0,0,0,0.1)",
          }}
        />
        <Legend />
        <Bar
          dataKey="sales"
          fill={theme.palette.primary.main}
          name="Sales"
          radius={[4, 4, 0, 0]}
        />
        <Line
          type="monotone"
          dataKey="purchase"
          stroke="#FF6B6B"
          strokeWidth={3}
          name="Purchase"
          dot={{ r: 4, fill: "#FF6B6B", strokeWidth: 2, stroke: "#fff" }}
          activeDot={{ r: 6, strokeWidth: 0 }}
        />
      </ComposedChart>
    </Box>
  );
}

export default YearlyOverview;
