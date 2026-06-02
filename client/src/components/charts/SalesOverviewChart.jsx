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

const SalesOverviewChart = () => {
  const theme = useTheme();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["last30DaysSales"],
    queryFn: () => getLast30DaysSales(),
  });

  if (isLoading) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography>Loading sales data...</Typography>
      </Box>
    );
  }

  if (isError) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography color="error">Failed to load sales data</Typography>
      </Box>
    );
  }

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 4,
        border: "1px solid",
        borderColor: "divider",
        width: "100%",
      }}
    >
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" fontWeight={700} color="text.primary">
          Sales Overview
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Monthly revenue growth of last 30 days
        </Typography>
      </Box>

      <Box sx={{ width: "100%", height: 350 }}>
        {/* <ResponsiveContainer
						width='100%'
						height='100%'
						debounce={1}> */}
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
        {/* </ResponsiveContainer> */}
      </Box>
    </Paper>
  );
};

export default SalesOverviewChart;
