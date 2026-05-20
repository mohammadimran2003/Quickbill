import { Grid } from '@mui/material';
import { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import StatCard from '../shared/StatCard';
import getDashboardSummery from '../../api/dashboard_api/getDashboardSummery';

const DashboardTop = () => {
	const [summary, setSummary] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchSummary = async () => {
			setLoading(true);
			try {
				const data = await getDashboardSummery();
				setSummary(data.data);
			} catch (err) {
				console.error('Dashboard summary error:', err);
				setError('Failed to load dashboard summary');
			} finally {
				setLoading(false);
			}
		};

		fetchSummary();
	}, []);

	const { today, allTime } = summary || {};

	if (loading) {
		return (
			<Box sx={{ p: 4 }}>
				<Typography>Loading dashboard...</Typography>
			</Box>
		);
	}

	if (error) {
		return (
			<Box sx={{ p: 4 }}>
				<Typography color='error'>{error}</Typography>
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
