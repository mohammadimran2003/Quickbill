import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  // ResponsiveContainer,
} from "recharts";
import { Box, Typography, Paper, useTheme } from "@mui/material";

import getLast30DaysSales from "../../api/dashboard_api/getLast30DaysSales";
import { useQuery } from "@tanstack/react-query";
import ChartMenuSkeleton from "../shared/skeletons/ChartMenuSkeleton";

const SalesOverviewChart = () => {
  const theme = useTheme();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["last30DaysSales"],
    queryFn: () => getLast30DaysSales(),
  });

  if (isLoading) {
    return <ChartMenuSkeleton />;
  }

  if (isError) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography color="error">Failed to load sales data</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", height: 350 }}>
      <AreaChart
        width="100%"
        height={350}
        data={data?.data}
        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
      >
        <CartesianGrid
          vertical={false}
          strokeDasharray="3 3"
          stroke="#f0f0f0"
        />

        <XAxis
          dataKey="date"
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

        <Area
          type="monotone"
          dataKey="sales"
          stroke={theme.palette.primary.main}
          strokeWidth={3}
          fillOpacity={1}
          fill="url(#colorSales)"
          dot={{ r: 4, fill: "#4CAF50", strokeWidth: 2, stroke: "#fff" }}
          activeDot={{ r: 6, strokeWidth: 0 }}
        />
      </AreaChart>
    </Box>
  );
};

export default SalesOverviewChart;
