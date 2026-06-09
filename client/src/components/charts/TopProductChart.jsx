import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  // ResponsiveContainer,
  Legend,
} from "recharts";
import { Paper, Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import getTopProducts from "../../api/dashboard_api/getTopProducts";
import { useQuery } from "@tanstack/react-query";
import PieChartSkeleton from "../shared/skeletons/PieChartSkeleton";

// Professional Color Palette
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

const TopProductChart = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["topProducts"],
    queryFn: () => getTopProducts(),
  });

  const hasData = data?.data && data.data.length > 0;

  if (isLoading) {
    return <PieChartSkeleton />;
  }

  if (isError) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography color="error">Failed to load top products data</Typography>
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
          Top {data?.data.length} Products
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Sales distribution by product value
        </Typography>
      </Box>

      <Box
        sx={{
          width: "100%",
          height: 350,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {hasData ? (
          <PieChart width={350} height={350}>
            {" "}
            {/* 💡 টিপ: PieChart এ width স্ট্রিং না দিয়ে নাম্বার দেওয়া ভালো */}
            <Pie
              data={data?.data}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={100}
              paddingAngle={5}
              dataKey="totalSales"
            >
              {data?.data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                borderRadius: "8px",
                border: "none",
                boxShadow: "0px 4px 20px rgba(0,0,0,0.1)",
              }}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              formatter={(value) => (
                <span
                  style={{ color: "#555", fontWeight: 500, fontSize: "13px" }}
                >
                  {value}
                </span>
              )}
            />
          </PieChart>
        ) : (
          // 🟢 নো-ডাটা স্টেট (UX ফ্রেন্ডলি)
          <Box sx={{ textAlign: "center" }}>
            <Typography
              variant="body1"
              fontWeight={600}
              color="text.secondary"
              sx={{ mb: 0.5 }}
            >
              No Sales Data Available
            </Typography>
            <Typography variant="caption" color="text.disabled">
              Once you make sales, the top products chart will appear here.
            </Typography>
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default TopProductChart;
