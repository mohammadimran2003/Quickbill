import { Box, Typography, Badge, IconButton } from '@mui/material';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import UserProfile from '../profile/UserProfile';
import { useTheme } from '@mui/material';
import { Outlet } from 'react-router-dom';

function LayoutHeader() {
	const theme = useTheme();
	return (
		<Box
			sx={{
				position: 'relative',
				flex: 1,
				display: 'flex',
				flexDirection: 'column',
				height: '100vh',
				zIndex: 200,
				overflowY: 'auto',
				'&::-webkit-scrollbar': {
					width: 6,
				},
				'&::-webkit-scrollbar-thumb': {
					backgroundColor: '#ccc',
					borderRadius: 10,
				},
				'&::-webkit-scrollbar-thumb:hover': {
					backgroundColor: '#999',
				},
			}}>
			<Box
				sx={{
					px: 4,
					py: 2,
					position: 'sticky',
					top: 0,
					zIndex: 100,
					backgroundColor: 'rgba(255,255,255,0.5)',
					backdropFilter: 'blur(10px)',
					WebkitBackdropFilter: 'blur(10px)',

					borderBottom: `1px solid ${theme.palette.divider}`,
				}}>
				<Box
					sx={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between',
						gap: 2,

						flexWrap: 'wrap',
					}}>
					<Box>
						<Typography
							variant='h4'
							fontWeight={700}
							gutterBottom>
							Dashboard
						</Typography>
					</Box>
					<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
						<Badge
							badgeContent={5}
							color='error'>
							<IconButton
								sx={{
									bgcolor: theme.palette.background.paper,
									boxShadow: 1,
								}}>
								<NotificationsNoneOutlinedIcon />
							</IconButton>
						</Badge>
						<UserProfile />
					</Box>
				</Box>
			</Box>
			<Box
				sx={{
					flex: 1,

					p: 4,
				}}>
				<Outlet />
			</Box>
		</Box>
	);
}

export default LayoutHeader;
