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
import ProfitByCategoryChart from '../../components/profits_report_comp/ProfitByCategoryChart';
import ProfitReportPrint from '../../components/print/ProfitReportPrint';

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
	console.log('summary', summary);

	const totalRevenue = summary?.totalRevenue || 0;
	const totalProfit = summary?.totalProfit || 0;
	const totalCostPrice = summary?.totalCostPrice || 0;

	const profitMargin = totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(1) : '0.0';
	const markupPercentage = totalCostPrice > 0 ? ((totalProfit / totalCostPrice) * 100).toFixed(1) : '0.0';

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
				<ProfitVsRevenueChart data={chartData} groupBy={groupBy} />
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

// ২. Profit Report (মুনাফা রিপোর্ট) এ কী দেখানো উচিত:
// এখানে কাস্টমার ফোকাস করে না, বরং ফোকাস থাকে "মার্জিন (Margin)" এবং "ব্যবসায়িক দক্ষতা (Efficiency)"-র ওপর। এখানে আপনি দেখাতে পারেন:

// Profit Margin Percentage (মুনাফার শতকরা হার): শুধু টাকার অংকে লাভ না দেখিয়ে Gross Profit Margin দেখানো। যেমন: (Profit / Revenue) * 100। অর্থাৎ, ১ টাকা বিক্রি করলে আপনার কয় পয়সা বা কত পার্সেন্ট লাভ হচ্ছে (যেমন: ২৫% লাভ বা ৩০% লাভ)।
// Category & Brand wise Profit (ক্যাটাগরি ও ব্র্যান্ড ভিত্তিক লাভ): কোন ক্যাটাগরি বা ব্র্যান্ডের প্রোডাক্ট বিক্রি করে আপনার সবচেয়ে বেশি লাভ হচ্ছে। (অনেক সময় কমদামী জিনিস বেশি বিক্রি হলেও লাভ কম হয়, আবার দামী জিনিস কম বিক্রি হলেও বেশি লাভ হয়। এটা লাভ রিপোর্টে পরিষ্কার হয়)।
// Cost of Goods Sold (COGS) vs Net Profit (ক্রয়মূল্য বনাম আসল লাভ): একটি পাই চার্ট বা বার চার্ট দিয়ে দেখানো যে মোট বিক্রির কত পার্সেন্ট প্রোডাক্ট কিনতে খরচ হয়েছে (COGS) আর কত পার্সেন্ট পকেটে লাভ হিসেবে ঢুকেছে।
// Discounts & Loss Analysis (ছাড় ও ক্ষতির বিশ্লেষণ): অর্ডারে ডিসকাউন্ট দেওয়ার কারণে আপনার কত টাকা প্রফিট কমে গেল বা লোকসান হলো সেটার হিসাব।
// High Margin Products (সবচেয়ে বেশি লাভজনক প্রোডাক্ট): সবচেয়ে বেশি বিক্রি হওয়া প্রোডাক্ট নয়, বরং সবচেয়ে বেশি পার্সেন্টেজ লাভ বা বেশি মার্জিন থাকা ৫টি প্রোডাক্টের তালিকা (যেমন: একটা প্রোডাক্ট বিক্রি করলেই ৫০% লাভ থাকে)।
// সংক্ষেপে পার্থক্য:
// Sales Report বলে: "এই মাসে ৫,০০,০০০ টাকার বিক্রি হয়েছে এবং ৩,০০০ পিস প্রোডাক্ট ডেলিভারি হয়েছে।"
// Profit Report বলে: "এই মাসে মোট বিক্রির মধ্যে আমাদের প্রফিট মার্জিন ছিল ২২%, যার মধ্যে ইলেকট্রনিক্স ক্যাটাগরি থেকে সবচেয়ে বেশি ৩০% লাভ এসেছে এবং ডিসকাউন্টের কারণে প্রফিট মার্জিন ৩% কমে গেছে।"
