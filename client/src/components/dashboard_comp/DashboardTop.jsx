import { Grid } from "@mui/material";
import { Box, Typography } from "@mui/material";
import StatCard from "../shared/StatCard";
import getDashboardSummery from "../../api/dashboard_api/getDashboardSummery";
import { useQuery } from "@tanstack/react-query";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import getExpenseStats from "../../api/expenses_api/getExpenseStats";
import StatsSkeleton from "../shared/skeletons/StatsSkeleton";
const DashboardTop = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["dashboardSummery"],
    queryFn: () => getDashboardSummery(),
  });
  const {
    data: expenseData,
    isLoading: expenseLoading,
    isError: expenseError,
  } = useQuery({
    queryKey: ["expenseStats"],
    queryFn: () => getExpenseStats(),
  });

  const { today, allTime } = data?.data || {};

  if (isLoading) {
    return <StatsSkeleton />;
  }

  if (isError) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography color="error">Failed to load dashboard summary</Typography>
      </Box>
    );
  }
  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      <Grid size={3}>
        <StatCard
          title="Today Sales"
          value={today.sales}
          icon={<AttachMoneyIcon sx={{ fontSize: 28 }} />}
          type="sales"
        />
      </Grid>

      <Grid size={3}>
        <StatCard
          title="Today Orders"
          value={today.orders}
          icon={<ShoppingCartIcon sx={{ fontSize: 28 }} />}
          type="orders"
        />
      </Grid>

      <Grid size={3}>
        <StatCard
          title="Today Profit"
          value={today.profit}
          icon={<TrendingUpIcon sx={{ fontSize: 28 }} />}
          type="profit"
        />
      </Grid>
      <Grid size={3}>
        <StatCard
          title="All Time Sales"
          value={Math.round(allTime.revenue)}
          icon={<AccountBalanceWalletIcon sx={{ fontSize: 28 }} />}
          type="sales"
        />
      </Grid>
      <Grid size={3}>
        <StatCard
          title="Expense This month"
          value={Math.round(expenseData?.data?.thisMonth || 0)}
          icon={<AccountBalanceWalletIcon sx={{ fontSize: 28 }} />}
          type="expense"
        />
      </Grid>
    </Grid>
  );
};

export default DashboardTop;
