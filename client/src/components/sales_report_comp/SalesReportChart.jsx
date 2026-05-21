import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
	Brush,
} from 'recharts';
import { Box, Paper, Typography, useTheme } from '@mui/material';
import BarChartIcon from '@mui/icons-material/BarChart';

const CustomTooltip = ({ active, payload, label }) => {
	if (active && payload && payload.length) {
		return (
			<Paper
				elevation={4}
				sx={{
					p: 1.5,
					borderRadius: 2,
					minWidth: 160,
					border: '1px solid',
					borderColor: 'divider',
				}}>
				<Typography
					variant='caption'
					color='text.secondary'
					display='block'
					sx={{ mb: 0.5, fontWeight: 600 }}>
					{label}
				</Typography>
				{payload.map((entry) => (
					<Box
						key={entry.name}
						sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
						<Box
							sx={{
								width: 10,
								height: 10,
								borderRadius: '50%',
								bgcolor: entry.color,
							}}
						/>
						<Typography
							variant='caption'
							color='text.secondary'>
							{entry.name}:
						</Typography>
						<Typography
							variant='caption'
							fontWeight={700}>
							{entry.name === 'Orders' ?
								entry.value
							:	`৳ ${Number(entry.value).toLocaleString()}`}
						</Typography>
					</Box>
				))}
			</Paper>
		);
	}
	return null;
};

export default function SalesReportChart({ data = [], groupBy = 'daily' }) {
	const theme = useTheme();

	const isEmpty = !data || data.length === 0;

	// Format x-axis label based on groupBy
	const formatLabel = (dateStr) => {
		if (!dateStr) return '';
		if (groupBy === 'monthly') {
			const [year, month] = dateStr.split('-');
			const monthNames = [
				'Jan',
				'Feb',
				'Mar',
				'Apr',
				'May',
				'Jun',
				'Jul',
				'Aug',
				'Sep',
				'Oct',
				'Nov',
				'Dec',
			];
			return `${monthNames[parseInt(month) - 1]} '${year.slice(2)}`;
		}
		if (groupBy === 'weekly') {
			return `Wk ${dateStr.slice(5)}`;
		}
		// daily: show MM/DD
		return dateStr.slice(5).replace('-', '/');
	};

	const chartData = data.map((d) => ({
		...d,
		label: formatLabel(d.date),
	}));

	return (
		<Paper
			elevation={0}
			sx={{
				p: 3,
				borderRadius: 3,
				border: '1px solid',
				borderColor: 'divider',
				boxShadow: '0px 4px 20px rgba(0,0,0,0.05)',
			}}>
			{/* Header */}
			<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
				<Box
					sx={{
						width: 36,
						height: 36,
						borderRadius: 2,
						bgcolor: '#E8F8F2',
						color: '#00A76F',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
					}}>
					<BarChartIcon fontSize='small' />
				</Box>
				<Box>
					<Typography
						variant='subtitle1'
						fontWeight={700}>
						Sales Overview
					</Typography>
					<Typography
						variant='caption'
						color='text.secondary'>
						Revenue & Profit by{' '}
						{groupBy.charAt(0).toUpperCase() + groupBy.slice(1)} Period
					</Typography>
				</Box>
			</Box>

			{/* Chart */}
			{isEmpty ?
				<Box
					sx={{
						height: 300,
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						justifyContent: 'center',
						color: 'text.disabled',
						gap: 1,
					}}>
					<BarChartIcon sx={{ fontSize: 48, opacity: 0.3 }} />
					<Typography
						variant='body2'
						color='text.secondary'>
						Filter data to view sales reports
					</Typography>
				</Box>
			:	<ResponsiveContainer
					width='100%'
					height={320}>
					<BarChart
						data={chartData}
						margin={{ top: 4, right: 16, left: 8, bottom: 4 }}
						barCategoryGap='30%'
						barGap={4}>
						<CartesianGrid
							strokeDasharray='3 3'
							stroke={theme.palette.divider}
							vertical={false}
						/>
						<XAxis
							dataKey='label'
							tick={{ fontSize: 12, fill: theme.palette.text.secondary }}
							axisLine={false}
							tickLine={false}
						/>
						<YAxis
							yAxisId='money'
							tick={{ fontSize: 12, fill: theme.palette.text.secondary }}
							axisLine={false}
							tickLine={false}
							tickFormatter={(v) =>
								v >= 1000 ? `৳${(v / 1000).toFixed(0)}k` : `৳${v}`
							}
						/>
						<YAxis
							yAxisId='orders'
							orientation='right'
							tick={{ fontSize: 12, fill: theme.palette.text.secondary }}
							axisLine={false}
							tickLine={false}
							allowDecimals={false}
						/>
						<Tooltip content={<CustomTooltip />} />
						<Legend
							iconType='circle'
							iconSize={8}
							wrapperStyle={{ fontSize: 13, paddingTop: 12 }}
						/>
						<Bar
							yAxisId='money'
							dataKey='revenue'
							name='Revenue'
							fill='#00A76F'
							radius={[4, 4, 0, 0]}
						/>
						<Bar
							yAxisId='money'
							dataKey='profit'
							name='Profit'
							fill='#FFAB00'
							radius={[4, 4, 0, 0]}
						/>
						<Bar
							yAxisId='orders'
							dataKey='orders'
							name='Orders'
							fill='#1565C0'
							radius={[4, 4, 0, 0]}
							opacity={0.75}
						/>
						{chartData.length > 15 && (
							<Brush
								dataKey='date'
								height={30}
								stroke='#8884d8'
								startIndex={chartData.length - 15}
							/>
						)}
					</BarChart>
				</ResponsiveContainer>
			}
		</Paper>
	);
}
