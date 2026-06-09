import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { Paper, Box, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import getExpensesChart from "../../api/expenses_api/getExpensesChart";
import PieChartSkeleton from "../shared/skeletons/PieChartSkeleton";

// Professional Color Palette
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

const ExpensesChart = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["expensesChart"],
    queryFn: () => getExpensesChart(),
  });

  const hasData = data?.chartData && data.chartData.length > 0;

  if (isLoading) {
    return <PieChartSkeleton />;
  }

  if (isError) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography color="error">Failed to load expenses data</Typography>
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
          Expense this month
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Expense distribution by category
        </Typography>
      </Box>

      {hasData ? (
        <Box sx={{ width: "100%", height: 350 }}>
          <PieChart width="100%" height={350}>
            <Pie
              data={data?.chartData}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
            >
              {data?.chartData.map((entry, index) => (
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
                  style={{
                    color: "#555",
                    fontWeight: 500,
                    fontSize: "13px",
                  }}
                >
                  {value}
                </span>
              )}
            />
          </PieChart>
        </Box>
      ) : (
        <Box sx={{ p: 4, textAlign: "center" }}>
          <Typography color="text.secondary">
            No expense data available
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default ExpensesChart;
