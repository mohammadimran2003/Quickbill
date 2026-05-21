import { Grid } from '@mui/material';
import { Box, Typography } from '@mui/material';
import StatCard from '../shared/StatCard';
import getDashboardSummery from '../../api/dashboard_api/getDashboardSummery';
import { useQuery } from '@tanstack/react-query';

const DashboardTop = () => {
	const { data, isLoading, isError } = useQuery({
		queryKey: ['dashboardSummery'],
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
				<Typography color='error'>Failed to load dashboard summary</Typography>
			</Box>
		);
	}
	return (
		<Grid
			container
			spacing={3}
			sx={{ mb: 4 }}>
			<Grid size={3}>
				<StatCard
					title='Today Sales'
					value={today.sales}
					type='revenue'
				/>
			</Grid>

			<Grid size={3}>
				<StatCard
					title='Today Orders'
					value={today.orders}
					type='orders'
				/>
			</Grid>

			<Grid size={3}>
				<StatCard
					title='Today Profit'
					value={today.profit}
					type='profit'
				/>
			</Grid>
			<Grid size={3}>
				<StatCard
					title='All Time Sales'
					value={Math.round(allTime.revenue)}
					type='total'
				/>
			</Grid>
		</Grid>
	);
};

export default DashboardTop;
