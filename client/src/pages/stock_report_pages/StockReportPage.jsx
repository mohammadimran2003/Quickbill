import {
	Box,
	CircularProgress,
	Grid,
	IconButton,
	Typography,
} from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import DateRangeFilter from '../../components/shared/DateRangeFilter';
import { useQuery } from '@tanstack/react-query';
import { get } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import dayjs from 'dayjs';
import getStockReports from '../../api/reports_api/getStockReports';
import StatCard from '../../components/shared/StatCard';
import fmt from '../../utils/fmt';
import StockReportTable from '../../components/stocks_report_comp/StockReportTable';
import TopLowStockTable from '../../components/stocks_report_comp/TopLowStockTable';
import StockByCategoryChart from '../../components/charts/StockByCategoryChart';
import StockReportPrint from '../../components/print/StockReportPrint';

function StockReportPage() {
	const [searchParams, setSearchParams] = useSearchParams();
	const [groupBy, setGroupBy] = useState('daily');
	const contentRef = useRef(null);

	const handlePrint = useReactToPrint({
		contentRef: contentRef,
		documentTitle: `Stock_Report_${searchParams.get('from') || 'start'}_to_${searchParams.get('to') || 'end'}`,
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
		queryKey: ['stock-report', searchParams.toString()],
		queryFn: () => getStockReports(searchParams),
	});
	const handleFilterChange = async (filters) => {
		console.log(filters, 'filters');

		setSearchParams({
			from: filters.startDate,
			to: filters.endDate,
			groupBy: filters.groupBy,
		});
	};

	console.log(data, 'data');
	const { summary } = data?.data || {};

	if (isLoading) {
		return (
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					height: '100vh',
				}}>
				<CircularProgress />
			</Box>
		);
	}
	if (isError) {
		return (
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					height: '100vh',
				}}>
				<Typography
					variant='h6'
					color='error'>
					{error.message}
				</Typography>
			</Box>
		);
	}

	return (
		<Box>
			{/* Hidden Print Template */}
			<div style={{ display: 'none' }}>
				<StockReportPrint
					ref={contentRef}
					summary={summary}
					stockDetails={data?.data?.stockDetails}
					topLowStockProducts={data?.data?.topLowStockProducts}
					stockByCategory={data?.data?.stockByCategory}
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
					mb: 4,
				}}>
				<Typography variant='h6'>Stock Report</Typography>
				<IconButton
					color='primary'
					size='large'
					onClick={handlePrint}>
					<PrintIcon />
				</IconButton>
			</Box>
			<Box sx={{ mb: 3 }}>
				<DateRangeFilter onFilterChange={handleFilterChange} />
			</Box>

			<Grid
				container
				spacing={3}
				sx={{ mb: 3 }}>
				<Grid size={3}>
					<StatCard
						title='Total Stock Value'
						value={fmt(summary?.totalStockValue)}
						type='total'
					/>
				</Grid>
				<Grid size={3}>
					<StatCard
						title='Total Products'
						value={summary?.totalProducts ?? '—'}
						iconConfig={{
							icon: <Inventory2Icon sx={{ fontSize: 28 }} />,
							bg: '#E8EAF6',
							color: '#283593',
						}}
					/>
				</Grid>
				<Grid size={3}>
					<StatCard
						title='Low Stock Products'
						value={summary?.lowStockItems ?? '—'}
						iconConfig={{
							icon: <WarningAmberIcon sx={{ fontSize: 28 }} />,
							bg: '#FFF3E0',
							color: '#E65100',
						}}
					/>
				</Grid>
				<Grid size={3}>
					<StatCard
						title='Out of Stock'
						value={summary?.outOfStockItems ?? '—'}
						iconConfig={{
							icon: <ErrorOutlineOutlinedIcon sx={{ fontSize: 28 }} />,
							bg: '#FFEBEE',
							color: '#C62828',
						}}
					/>
				</Grid>
			</Grid>

			<StockReportTable stockDetails={data?.data?.stockDetails} />

			<Grid
				container
				spacing={3}
				sx={{ mt: 3, alignItems: 'flex-start' }}>
				<Grid size={6}>
					<TopLowStockTable
						topLowStockProducts={data?.data?.topLowStockProducts}
					/>
				</Grid>
				<Grid size={6}>
					<StockByCategoryChart stockByCategory={data?.data?.stockByCategory} />
				</Grid>
			</Grid>
		</Box>
	);
}

export default StockReportPage;
