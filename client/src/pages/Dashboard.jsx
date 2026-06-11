import { Grid } from "@mui/material";
import ChartMenu from "../components/charts/ChartMenu.jsx";
import DashboardTop from "../components/dashboard_comp/DashboardTop.jsx";
import TopProductChart from "../components/charts/TopProductChart.jsx";
import RecentOrders from "../components/dashboard_comp/RecentOrders.jsx";
import useAuth from "../hooks/useAuth.js";
import ExpensesChart from "../components/charts/ExpensesChart.jsx";

function Dashboard() {
  const { user } = useAuth();

  const isAdmin = user?.role === "ADMIN";
  const isManager = user?.role === "MANAGER";

  return (
    <>
      <DashboardTop />

      <Grid container spacing={3}>
        <Grid size={8}>{isAdmin && <ChartMenu />}</Grid>
        <Grid size={4}>{(isAdmin || isManager) && <TopProductChart />}</Grid>
      </Grid>
      <Grid container spacing={3} sx={{ my: 2 }}>
        <Grid size={8}>
          <RecentOrders />
        </Grid>{" "}
        <Grid size={4}>
          <ExpensesChart />
        </Grid>
      </Grid>
    </>
  );
}

export default Dashboard;
