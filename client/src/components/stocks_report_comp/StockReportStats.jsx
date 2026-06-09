import { Grid } from "@mui/material";
import StatCard from "../shared/StatCard";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";

import StatsSkeleton from "../shared/skeletons/StatsSkeleton";
import useFmt from "../../hooks/useFmt";

function StockReportStats({ summary, isLoading }) {
  const fmt = useFmt();

  if (isLoading) {
    return <StatsSkeleton />;
  }
  return (
    <Grid container spacing={3} sx={{ mb: 3 }}>
      <Grid size={3}>
        <StatCard
          title="Total Stock Value"
          value={fmt(summary?.totalStockValue)}
          icon={<AccountBalanceWalletIcon sx={{ fontSize: 28 }} />}
          type="positive"
        />
      </Grid>
      <Grid size={3}>
        <StatCard
          title="Total Products"
          value={summary?.totalProducts ?? "—"}
          icon={<Inventory2Icon sx={{ fontSize: 28 }} />}
          type="positive"
        />
      </Grid>
      <Grid size={3}>
        <StatCard
          title="Low Stock Products"
          value={summary?.lowStockItems ?? "—"}
          icon={<WarningAmberIcon sx={{ fontSize: 28 }} />}
          type="warning"
        />
      </Grid>
      <Grid size={3}>
        <StatCard
          title="Out of Stock"
          value={summary?.outOfStockItems ?? "—"}
          icon={<ErrorOutlineOutlinedIcon sx={{ fontSize: 28 }} />}
          type="negative"
        />
      </Grid>
    </Grid>
  );
}

export default StockReportStats;
