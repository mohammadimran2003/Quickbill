import { Grid } from "@mui/material";
import StatCard from "../shared/StatCard";
import fmt from "../../utils/fmt";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";

function SalesStats({ summary }) {
  return (
    <Grid container spacing={3} sx={{ mb: 3 }}>
      <Grid size={3}>
        <StatCard
          title="Total Revenue"
          value={fmt(summary?.totalRevenue)}
          icon={<AttachMoneyIcon sx={{ fontSize: 28 }} />}
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
