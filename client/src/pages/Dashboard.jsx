import { Grid } from '@mui/material';
import SalesOverviewChart from '../components/charts/SalesOverviewChart';
import DashboardTop from '../components/dashboard_comp/DashboardTop';
import TopProductChart from '../components/charts/TopProductChart';
import RecentOrders from '../components/dashboard_comp/RecentOrders';
import useAuth from '../hooks/useAuth';

function Dashboard() {
	const { user } = useAuth();

	console.log(user, 'user');

	const isSalesman = user?.role === 'SALESMAN';
	const isAdmin = user?.role === 'ADMIN';
	const isManager = user?.role === 'MANAGER';

	return (
		<>
			<DashboardTop />
			<Grid
				container
				spacing={3}>
				<Grid size={8}>{isAdmin && <SalesOverviewChart />}</Grid>
				<Grid size={4}>{(isAdmin || isManager) && <TopProductChart />}</Grid>
				<RecentOrders />
			</Grid>
		</>
	);
}

export default Dashboard;
