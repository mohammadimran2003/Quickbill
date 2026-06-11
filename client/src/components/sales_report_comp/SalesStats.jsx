import { Grid } from "@mui/material";
import StatCard from "../shared/StatCard.jsx";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import StatsSkeleton from "../shared/skeletons/StatsSkeleton.jsx";
import TakaIcon from "../shared/TakaIcon.jsx";
import useFmt from "../../hooks/useFmt.js";

function SalesStats({ summary, isLoading }) {
  const fmt = useFmt();

  if (isLoading) {
    return <StatsSkeleton />;
  }

  return (
    <Grid container spacing={3} sx={{ mb: 3 }}>
      <Grid size={3}>
        <StatCard
          title="Total Revenue"
          value={fmt(summary?.totalRevenue)}
          icon={<TakaIcon sx={{ fontSize: 28 }} />}
          type="revenue"
        />
      </Grid>
      <Grid size={3}>
        <StatCard
          title="Total Orders"
          value={summary?.totalOrders ?? "—"}
          icon={<ShoppingCartIcon sx={{ fontSize: 28 }} />}
          type="orders"
        />
      </Grid>
      <Grid size={3}>
        <StatCard
          title="Total Profit"
          value={fmt(summary?.totalProfit)}
          icon={<TrendingUpIcon sx={{ fontSize: 28 }} />}
          type="profit"
        />
      </Grid>
      <Grid size={3}>
        <StatCard
          title="Avg Order Value"
          value={fmt(summary?.avgOrderValue?.toFixed(2))}
          icon={<AccountBalanceWalletIcon sx={{ fontSize: 28 }} />}
          type="avgOrderValue"
        />
      </Grid>
    </Grid>
  );
}

export default SalesStats;
