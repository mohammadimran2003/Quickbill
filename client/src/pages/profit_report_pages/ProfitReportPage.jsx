import { useState, useEffect, useRef } from 'react';
import {
	Box,
	Grid,
	CircularProgress,
	Typography,
	IconButton,
} from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import { useReactToPrint } from 'react-to-print';
import DateRangeFilter from '../../components/shared/DateRangeFilter';
import dayjs from 'dayjs';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import StatCard from '../../components/shared/StatCard';
import fmt from '../../utils/fmt';
import { getProfitReport } from '../../api/reports_api/getProfitReports';
import ProfitVsRevenueChart from '../../components/charts/ProfitVsRevenueChart';
import MostProfitableProducts from '../../components/profits_report_comp/MostProfitableProducts';
import ProfitReportPrint from '../../components/print/ProfitReportPrint';
import ProfitByCategoryChart from '../../components/charts/ProfitByCategoryChart';

function ProfitReportPage() {
	const [groupBy, setGroupBy] = useState('daily');
	const [searchParams, setSearchParams] = useSearchParams();
	const contentRef = useRef(null);

	const handlePrint = useReactToPrint({
		contentRef: contentRef,
		documentTitle: `Profit_Report_${searchParams.get('from') || 'start'}_to_${searchParams.get('to') || 'end'}`,
		onPrintError: () => {
			console.error('Failed to print');
		},
	});

	useEffect(() => {
		if (!searchParams.get('from')) {
			setSearchParams({
				from: dayjs().startOf('month').format('YYYY-MM-DD'),
				to: dayjs().format('YYYY-MM-DD'),
				groupBy: 'daily',
			});
		}
	}, []);

	const { data, isLoading, isError, error } = useQuery({
		queryKey: ['profit-report', searchParams.toString()],
		queryFn: () => getProfitReport(searchParams),
		enabled: !!searchParams.get('from'),
	});

	const handleFilterChange = (dateRange) => {
		setGroupBy(dateRange.groupBy);

		setSearchParams({
			from: dateRange.startDate,
			to: dateRange.endDate,
			groupBy: dateRange.groupBy,
		});
	};

	console.log(data, 'data in page');

	const summary = data?.data?.summary || {};
	const chartData = data?.data?.chartData || [];
	const profitableProducts = data?.data?.profitableProducts || [];
	const profitByCategory = data?.data?.profitByCategory || [];

	const totalRevenue = summary?.totalRevenue || 0;
	const totalProfit = summary?.totalProfit || 0;
	const totalCostPrice = summary?.totalCostPrice || 0;

	const profitMargin =
		totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(1) : '0.0';
	const markupPercentage =
		totalCostPrice > 0 ?
			((totalProfit / totalCostPrice) * 100).toFixed(1)
		:	'0.0';

	if (isLoading) {
		return (
			<Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
				<CircularProgress />
			</Box>
		);
	}

	if (isError) {
		return (
			<Box sx={{ p: 4 }}>
				<Typography
					variant='h6'
					color='error'>
					Error loading profit report: {error?.message}
				</Typography>
			</Box>
		);
	}

	return (
		<Box sx={{ p: 4 }}>
			{/* Hidden Print Template */}
			<div style={{ display: 'none' }}>
				<ProfitReportPrint
					ref={contentRef}
					summary={summary}
					chartData={chartData}
					profitableProducts={profitableProducts}
					profitByCategory={profitByCategory}
					dateRange={{
						from: searchParams.get('from'),
						to: searchParams.get('to'),
					}}
				/>
			</div>
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					mb: 3,
				}}>
				<Typography variant='h4'>Profit Report</Typography>
				<IconButton
					size='large'
					color='primary'
					onClick={handlePrint}>
					<PrintIcon />
				</IconButton>
			</Box>
			{/* Filter */}
			<Box sx={{ mb: 3 }}>
				<DateRangeFilter onFilterChange={handleFilterChange} />
			</Box>

			<Grid
				container
				spacing={3}
				sx={{ mb: 3 }}>
				<Grid size={3}>
					<StatCard
						title='Total Revenue'
						value={fmt(summary?.totalRevenue)}
						type='revenue'
					/>
				</Grid>
				<Grid size={3}>
					<StatCard
						title='Total Orders'
						value={summary?.totalOrders ?? '—'}
						type='orders'
					/>
				</Grid>
				<Grid size={3}>
					<StatCard
						title='Total Profit'
						value={fmt(summary?.totalProfit)}
						type='profit'
						badgeText={`${profitMargin}% Margin`}
					/>
				</Grid>
				<Grid size={3}>
					<StatCard
						title='Total Cost Price'
						value={fmt(summary?.totalCostPrice)}
						type='total'
						badgeText={`${markupPercentage}% Markup`}
					/>
				</Grid>
			</Grid>

			{/* Profit vs Revenue Trend Chart */}
			<Box sx={{ mt: 4 }}>
				<ProfitVsRevenueChart
					data={chartData}
					groupBy={groupBy}
				/>
			</Box>

			{/* Most Profitable Products Table + Profit by Category Chart */}
			<Grid
				container
				spacing={3}
				sx={{ mt: 4 }}
				alignItems='stretch'>
				<Grid size={8}>
					<MostProfitableProducts products={profitableProducts} />
				</Grid>
				<Grid size={4}>
					<ProfitByCategoryChart data={profitByCategory} />
				</Grid>
			</Grid>
		</Box>
	);
}

export default ProfitReportPage;
