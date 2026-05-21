import { Card, Box, Typography, Chip } from '@mui/material';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

const iconMap = {
	revenue: {
		icon: <AttachMoneyIcon sx={{ fontSize: 28 }} />,
		bg: '#E8F8F2',
		color: '#00A76F',
	},
	orders: {
		icon: <ShoppingCartIcon sx={{ fontSize: 28 }} />,
		bg: '#E3F2FD',
		color: '#1565C0',
	},
	profit: {
		icon: <TrendingUpIcon sx={{ fontSize: 28 }} />,
		bg: '#FFF8E1',
		color: '#FFAB00',
	},
	total: {
		icon: <AccountBalanceWalletIcon sx={{ fontSize: 28 }} />,
		bg: '#FFEBEE',
		color: '#B71D2B',
	},
};

const StatCard = ({ title, value, type, badgeText, iconConfig }) => {
	// iconConfig = { icon: <SomeIcon />, bg: '#hex', color: '#hex' }
	// If iconConfig is provided it takes priority; otherwise fall back to iconMap[type]
	const { icon, bg, color } = iconConfig || iconMap[type] || iconMap.revenue;

	return (
		<Card
			sx={{
				p: 3,
				borderRadius: 3,
				boxShadow: '0px 4px 20px rgba(0,0,0,0.05)',
				display: 'flex',
				justifyContent: 'space-between',
				alignItems: 'center',
				border: `1px solid ${bg}`,
				'&:hover': {
					boxShadow: '0px 6px 25px rgba(0,0,0,0.1)',
				},
			}}>
			<Box>
				<Typography
					variant='subtitle2'
					color='text.secondary'
					fontWeight={500}
					sx={{ mb: 1 }}>
					{title}
				</Typography>
				<Typography
					variant='h5'
					fontWeight={700}
					color='text.primary'>
					{value}
				</Typography>
				{badgeText && (
					<Box sx={{ mt: 1 }}>
						<Chip
							label={badgeText}
							size='small'
							sx={{
								bgcolor: bg,
								color: color,
								fontWeight: 700,
								fontSize: '0.68rem',
								height: 20,
								borderRadius: 1,
							}}
						/>
					</Box>
				)}
			</Box>

			<Box
				sx={{
					width: 48,
					height: 48,
					borderRadius: 2,
					background: bg,
					color: color,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
				}}>
				{icon}
			</Box>
		</Card>
	);
};

export default StatCard;
