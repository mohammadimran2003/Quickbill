import { Grid } from "@mui/material";
import { Box, Typography } from "@mui/material";
import StatCard from "../shared/StatCard";
import getDashboardSummery from "../../api/dashboard_api/getDashboardSummery";
import { useQuery } from "@tanstack/react-query";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";

const DashboardTop = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["dashboardSummery"],
    queryFn: () => getDashboardSummery(),
  });

  const { today, allTime } = data?.data || {};

  if (isLoading) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography>Loading dashboard...</Typography>
      </Box>
    );
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
          color="#00A76F"
          bgColor="#E8F8F2"
          borderColor="#E8F8F2"
        />
      </Grid>

      <Grid size={3}>
        <StatCard
          title="Today Orders"
          value={today.orders}
          icon={<ShoppingCartIcon sx={{ fontSize: 28 }} />}
          color="#1565C0"
          bgColor="#E3F2FD"
          borderColor="#E3F2FD"
        />
      </Grid>

      <Grid size={3}>
        <StatCard
          title="Today Profit"
          value={today.profit}
          icon={<TrendingUpIcon sx={{ fontSize: 28 }} />}
          color="#FFAB00"
          bgColor="#FFF8E1"
          borderColor="#FFF8E1"
        />
      </Grid>
      <Grid size={3}>
        <StatCard
          title="All Time Sales"
          value={Math.round(allTime.revenue)}
          icon={<AccountBalanceWalletIcon sx={{ fontSize: 28 }} />}
          color="#B71D2B"
          bgColor="#FFEBEE"
          borderColor="#FFEBEE"
        />
      </Grid>
      <Grid size={3}>
        <StatCard
          title="Expense This month"
          value={Math.round(allTime.revenue)}
          icon={<AccountBalanceWalletIcon sx={{ fontSize: 28 }} />}
          color="#B71D2B"
          bgColor="#FFEBEE"
          borderColor="#FFEBEE"
        />
      </Grid>
    </Grid>
  );
};

export default DashboardTop;
