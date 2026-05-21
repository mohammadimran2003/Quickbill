import {
	PieChart,
	Pie,
	Cell,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from 'recharts';
import { Box, Paper, Typography, Chip } from '@mui/material';
import DonutLargeIcon from '@mui/icons-material/DonutLarge';
import fmt from '../../utils/fmt';

// Curated vibrant color palette
const COLORS = [
	'#00A76F',
	'#FFAB00',
	'#0284C7',
	'#A78BFA',
	'#FF5630',
	'#22D3EE',
	'#F97316',
	'#EC4899',
	'#84CC16',
	'#6366F1',
];

const CustomTooltip = ({ active, payload }) => {
	if (active && payload && payload.length) {
		const d = payload[0].payload;
		return (
			<Paper
				elevation={4}
				sx={{
					p: 1.5,
					borderRadius: 2,
					minWidth: 190,
					border: '1px solid',
					borderColor: 'divider',
				}}>
				<Typography
					variant='caption'
					fontWeight={700}
					display='block'
					sx={{ mb: 0.5, color: payload[0].fill }}>
					{d.categoryName}
				</Typography>
				<Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.3 }}>
					<Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 3 }}>
						<Typography
							variant='caption'
							color='text.secondary'>
							Revenue
						</Typography>
						<Typography
							variant='caption'
							fontWeight={600}>
							{fmt(d.totalRevenue)}
						</Typography>
					</Box>
					<Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 3 }}>
						<Typography
							variant='caption'
							color='text.secondary'>
							Cost
						</Typography>
						<Typography
							variant='caption'
							fontWeight={600}>
							{fmt(d.totalCost)}
						</Typography>
					</Box>
					<Box
						sx={{
							display: 'flex',
							justifyContent: 'space-between',
							gap: 3,
							pt: 0.5,
							borderTop: '1px solid',
							borderColor: 'divider',
							mt: 0.5,
						}}>
						<Typography
							variant='caption'
							color='text.secondary'>
							Net Profit
						</Typography>
						<Typography
							variant='caption'
							fontWeight={700}
							sx={{ color: '#00A76F' }}>
							{fmt(d.netProfit)}
						</Typography>
					</Box>
					<Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 3 }}>
						<Typography
							variant='caption'
							color='text.secondary'>
							Margin
						</Typography>
						<Typography
							variant='caption'
							fontWeight={700}
							sx={{ color: '#FFAB00' }}>
							{d.profitMargin}%
						</Typography>
					</Box>
				</Box>
			</Paper>
		);
	}
	return null;
};

const CustomLegend = ({ payload }) => (
	<Box
		sx={{
			display: 'flex',
			flexWrap: 'wrap',
			gap: 1,
			justifyContent: 'center',
			mt: 1,
		}}>
		{payload.map((entry) => (
			<Chip
				key={entry.value}
				label={entry.value}
				size='small'
				sx={{
					bgcolor: `${entry.color}18`,
					color: entry.color,
					fontWeight: 600,
					fontSize: '0.72rem',
					border: `1px solid ${entry.color}40`,
					'& .MuiChip-label': { px: 1 },
				}}
			/>
		))}
	</Box>
);

// Custom label inside or outside the slice
const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
	if (percent < 0.05) return null; // skip tiny slices
	const RADIAN = Math.PI / 180;
	const radius = innerRadius + (outerRadius - innerRadius) * 0.55;
	const x = cx + radius * Math.cos(-midAngle * RADIAN);
	const y = cy + radius * Math.sin(-midAngle * RADIAN);
	return (
		<text
			x={x}
			y={y}
			fill='white'
			textAnchor='middle'
			dominantBaseline='central'
			fontSize={12}
			fontWeight={700}>
			{`${(percent * 100).toFixed(1)}%`}
		</text>
	);
};

export default function ProfitByCategoryChart({ data = [] }) {
	const isEmpty = !data || data.length === 0;

	// Recharts pie uses `value` key
	const chartData = data.map((d) => ({ ...d, value: d.netProfit }));

	return (
		<Paper
			elevation={0}
			sx={{
				p: 3,
				borderRadius: 3,
				border: '1px solid',
				borderColor: 'divider',
				boxShadow: '0px 4px 20px rgba(0,0,0,0.05)',
				height: '100%',
			}}>
			{/* Header */}
			<Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
				<Box
					sx={{
						width: 36,
						height: 36,
						borderRadius: 2,
						bgcolor: '#E3F2FD',
						color: '#0284C7',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
					}}>
					<DonutLargeIcon fontSize='small' />
				</Box>
				<Box>
					<Typography
						variant='subtitle1'
						fontWeight={700}>
						Profit by Category
					</Typography>
					<Typography
						variant='caption'
						color='text.secondary'>
						Which category drives the most profit
					</Typography>
				</Box>
			</Box>

			{/* Empty State */}
			{isEmpty ? (
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
					<DonutLargeIcon sx={{ fontSize: 48, opacity: 0.3 }} />
					<Typography
						variant='body2'
						color='text.secondary'>
						No category data available for this period
					</Typography>
				</Box>
			) : (
				<ResponsiveContainer
					width='100%'
					height={320}>
					<PieChart>
						<Pie
							data={chartData}
							dataKey='value'
							nameKey='categoryName'
							cx='50%'
							cy='50%'
							outerRadius={120}
							innerRadius={55}
							paddingAngle={3}
							labelLine={false}
							label={renderCustomLabel}>
							{chartData.map((entry, index) => (
								<Cell
									key={entry.categoryId}
									fill={COLORS[index % COLORS.length]}
									stroke='none'
								/>
							))}
						</Pie>
						<Tooltip content={<CustomTooltip />} />
						<Legend content={<CustomLegend />} />
					</PieChart>
				</ResponsiveContainer>
			)}

			{/* Summary rows below chart */}
			{!isEmpty && (
				<Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 0.8 }}>
					{data.slice(0, 5).map((cat, index) => (
						<Box
							key={cat.categoryId}
							sx={{
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'space-between',
							}}>
							<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
								<Box
									sx={{
										width: 10,
										height: 10,
										borderRadius: '50%',
										bgcolor: COLORS[index % COLORS.length],
										flexShrink: 0,
									}}
								/>
								<Typography
									variant='body2'
									sx={{
										maxWidth: 140,
										overflow: 'hidden',
										textOverflow: 'ellipsis',
										whiteSpace: 'nowrap',
									}}>
									{cat.categoryName}
								</Typography>
							</Box>
							<Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
								<Typography
									variant='body2'
									color='text.secondary'
									fontSize='0.75rem'>
									{cat.profitMargin}% margin
								</Typography>
								<Typography
									variant='body2'
									fontWeight={700}
									sx={{ color: '#00A76F', minWidth: 70, textAlign: 'right' }}>
									{fmt(cat.netProfit)}
								</Typography>
							</Box>
						</Box>
					))}
				</Box>
			)}
		</Paper>
	);
}
