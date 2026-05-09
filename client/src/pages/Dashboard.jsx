import { Grid } from '@mui/material';
import SalesOverviewChart from '../components/charts/SalesOverviewChart';
import DashboardTop from '../components/dashboard_comp/DashboardTop';
import TopProductChart from '../components/charts/TopProductChart';
import RecentOrders from '../components/dashboard_comp/RecentOrders';

function Dashboard() {
	return (
		<>
			<DashboardTop />
			<Grid
				container
				spacing={3}>
				<Grid size={8}>
					<SalesOverviewChart />
				</Grid>
				<Grid size={4}>
					<TopProductChart />
				</Grid>
				<RecentOrders />
			</Grid>
		</>
	);
}

export default Dashboard;
