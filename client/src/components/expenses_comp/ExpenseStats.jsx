import { Box, Grid, Typography, Chip, Stack, Skeleton } from "@mui/material";
import StatCard from "../shared/StatCard";
import { useQuery } from "@tanstack/react-query";
import getExpenseStats from "../../api/expenses_api/getExpenseStats";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import CategoryIcon from "@mui/icons-material/Category";
import StatsSkeleton from "../shared/skeletons/StatsSkeleton";

function ExpenseStats() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["expense-stats"],
    queryFn: getExpenseStats,
  });

  if (isLoading)
    return (
      <>
        <StatsSkeleton />
        <Box sx={{ my: 4 }}>
          <Skeleton variant="rectangular" width="100%" height={200} />
        </Box>
      </>
    );
  if (isError) return null;

  const stats = data?.data || {};

  const formatCurrency = (amount) => {
    return `৳${amount.toLocaleString()}`;
  };

  return (
    <Box sx={{ mb: 4, color: "text.primary" }}>
      <Grid container spacing={2}>
        <Grid size={4}>
          <StatCard
            title="This Month"
            value={formatCurrency(stats.thisMonth || 0)}
            icon={<CalendarMonthIcon sx={{ fontSize: 28 }} />}
            type="expenseThisMonth"
          />
        </Grid>
        <Grid size={4}>
          <StatCard
            title="All Time"
            value={formatCurrency(stats.allTime || 0)}
            icon={<AccountBalanceWalletIcon sx={{ fontSize: 28 }} />}
            type="expenseAllTime"
          />
        </Grid>
        <Grid size={4}>
          <StatCard
            title="By Category"
            value={`${Object.keys(stats.byCategory || {}).length} Categories`}
            icon={<CategoryIcon sx={{ fontSize: 28 }} />}
            type="expenseByCategory"
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
          <Stack direction="row" sx={{ flexWrap: "wrap" }} gap={1.5}>
            {Object.entries(stats.byCategory).map(([category, amount]) => (
              <Chip
                key={category}
                label={`${category}: ${formatCurrency(amount)}`}
                sx={{
                  bgcolor: "statCard.expenseByCategory.bg",
                  color: "statCard.expenseByCategory.color",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  height: 32,
                  mx: 0.5,
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
