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

// Curated vibrant color palette
const COLORS = [
	'#0284C7', // Sky Blue (Primary for Stock)
	'#00A76F', // Green
	'#FFAB00', // Yellow/Amber
	'#A78BFA', // Purple
	'#FF5630', // Red
	'#22D3EE', // Cyan
	'#F97316', // Orange
	'#EC4899', // Pink
	'#84CC16', // Lime
	'#6366F1', // Indigo
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
					minWidth: 160,
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
					<Box
						sx={{ display: 'flex', justifyContent: 'space-between', gap: 3 }}>
						<Typography
							variant='caption'
							color='text.secondary'>
							Total Stock
						</Typography>
						<Typography
							variant='caption'
							fontWeight={700}>
							{d.stock.toLocaleString()} items
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
const renderCustomLabel = ({
	cx,
	cy,
	midAngle,
	innerRadius,
	outerRadius,
	percent,
}) => {
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

function StockByCategoryChart({ stockByCategory = [] }) {
	const isEmpty = !stockByCategory || stockByCategory.length === 0;

	// Recharts pie uses `value` key
	const chartData = stockByCategory.map((d) => ({ ...d, value: d.stock }));

	const totalStock = stockByCategory.reduce(
		(sum, item) => sum + (item.stock || 0),
		0,
	);

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
						Stock by Category
					</Typography>
					<Typography
						variant='caption'
						color='text.secondary'>
						Which category has the most stock
					</Typography>
				</Box>
			</Box>

			{/* Empty State */}
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
					<DonutLargeIcon sx={{ fontSize: 48, opacity: 0.3 }} />
					<Typography
						variant='body2'
						color='text.secondary'>
						No category data available
					</Typography>
				</Box>
			:	<ResponsiveContainer
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
			}

			{/* Summary rows below chart */}
			{!isEmpty && (
				<Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 0.8 }}>
					{stockByCategory.slice(0, 5).map((cat, index) => {
						const percentage =
							totalStock > 0 ? ((cat.stock / totalStock) * 100).toFixed(1) : 0;
						return (
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
										{percentage}% share
									</Typography>
									<Typography
										variant='body2'
										fontWeight={700}
										sx={{ color: '#0284C7', minWidth: 70, textAlign: 'right' }}>
										{cat.stock.toLocaleString()} pcs
									</Typography>
								</Box>
							</Box>
						);
					})}
				</Box>
			)}
		</Paper>
	);
}

export default StockByCategoryChart;
