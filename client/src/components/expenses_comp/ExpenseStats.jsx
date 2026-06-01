import { Box, Grid, Typography, Chip, Stack } from "@mui/material";
import StatCard from "../shared/StatCard";
import { useQuery } from "@tanstack/react-query";
import getExpenseStats from "../../api/expenses_api/getExpenseStats";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import CategoryIcon from "@mui/icons-material/Category";

function ExpenseStats() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["expense-stats"],
    queryFn: getExpenseStats,
  });

  if (isLoading) return null;
  if (isError) return null;

  const stats = data?.data || {};

  const formatCurrency = (amount) => {
    return `৳${amount.toLocaleString()}`;
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Grid container spacing={2}>
        <Grid size={4}>
          <StatCard
            title="This Month"
            value={formatCurrency(stats.thisMonth || 0)}
            icon={<CalendarMonthIcon sx={{ fontSize: 28 }} />}
            color="#1565C0"
            bgColor="#E3F2FD"
            borderColor="#E3F2FD"
          />
        </Grid>
        <Grid size={4}>
          <StatCard
            title="All Time"
            value={formatCurrency(stats.allTime || 0)}
            icon={<AccountBalanceWalletIcon sx={{ fontSize: 28 }} />}
            color="#B71D2B"
            bgColor="#FFEBEE"
            borderColor="#FFEBEE"
          />
        </Grid>
        <Grid size={4}>
          <StatCard
            title="By Category"
            value={`${Object.keys(stats.byCategory || {}).length} Categories`}
            icon={<CategoryIcon sx={{ fontSize: 28 }} />}
            color="#FFAB00"
            bgColor="#FFF8E1"
            borderColor="#FFF8E1"
          />
        </Grid>
      </Grid>

      {stats.byCategory && Object.keys(stats.byCategory).length > 0 && (
        <Box
          sx={{
            mt: 3,
            p: 3,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 1,
          }}
        >
          <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
            Expense Breakdown by Category
          </Typography>
          <Stack direction="row" flexWrap="wrap" gap={1.5}>
            {Object.entries(stats.byCategory).map(([category, amount]) => (
              <Chip
                key={category}
                label={`${category}: ${formatCurrency(amount)}`}
                sx={{
                  bgcolor: "#E3F2FD",
                  color: "#1565C0",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  height: 32,
                }}
              />
            ))}
          </Stack>
        </Box>
      )}
    </Box>
  );
}

export default ExpenseStats;
