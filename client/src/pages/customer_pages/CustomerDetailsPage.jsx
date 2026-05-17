import {
	Box,
	Typography,
	Grid,
	Paper,
	Divider,
	Chip,
	Stack,
	IconButton,
	Button,
} from '@mui/material';
import {
	ArrowBack as ArrowBackIcon,
	Edit as EditIcon,
	Phone as PhoneIcon,
	Email as EmailIcon,
	LocationOn as LocationOnIcon,
	History as HistoryIcon,
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import getCustomerById from '../../api/customers_api/getCustomerById';

const CustomerDetailsPage = () => {
	const navigate = useNavigate();
	const { id } = useParams();

	const { data: customerData } = useQuery({
		queryFn: () => getCustomerById(id),
		queryKey: ['customers'],
	});

	// Jodi data load hote thake ba na thake
	if (!customerData)
		return <Typography>Loading customer details...</Typography>;

	const {
		name,
		email,
		customerType,
		isActive,
		phone,
		address,
		totalSpent,
		totalDue,
		walletBalance,
		creditLimit,
		note,
		createdAt,
	} = customerData.data;

	const infoItem = (icon, label, value) => (
		<Stack
			direction='row'
			spacing={2}
			sx={{ mb: 2 }}>
			<Box sx={{ color: 'primary.main', display: 'flex' }}>{icon}</Box>
			<Box>
				<Typography
					variant='caption'
					color='text.secondary'
					display='block'>
					{label}
				</Typography>
				<Typography
					variant='body1'
					fontWeight={500}>
					{value || 'N/A'}
				</Typography>
			</Box>
		</Stack>
	);

	const statCard = (label, value, color) => (
		<Paper
			variant='outlined'
			sx={{
				p: 2,
				textAlign: 'center',
				bgcolor: `${color}.50`,
				borderColor: `${color}.200`,
			}}>
			<Typography
				variant='caption'
				color='text.secondary'
				gutterBottom>
				{label}
			</Typography>
			<Typography
				variant='h6'
				color={`${color}.main`}
				fontWeight='bold'>
				৳{value?.toLocaleString()}
			</Typography>
		</Paper>
	);

	return (
		<Box sx={{ p: 3 }}>
			{/* Header Section */}
			<Stack
				direction='row'
				sx={{
					mb: 3,
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
				}}>
				<Stack
					direction='row'
					spacing={2}>
					<IconButton
						onClick={() => navigate(-1)}
						color='primary'>
						<ArrowBackIcon />
					</IconButton>
					<Box>
						<Typography
							variant='h5'
							fontWeight='bold'>
							{name}
						</Typography>
						<Stack
							direction='row'
							spacing={1}>
							<Chip
								label={customerType}
								size='small'
								color={customerType === 'WHOLESALE' ? 'secondary' : 'default'}
							/>
							<Chip
								label={isActive ? 'Active' : 'Inactive'}
								size='small'
								color={isActive ? 'success' : 'error'}
								variant='outlined'
							/>
						</Stack>
					</Box>
				</Stack>
				<Button
					variant='contained'
					startIcon={<EditIcon />}
					onClick={() => navigate(`/customers/edit/${id}`)}>
					Edit Customer
				</Button>
			</Stack>

			<Grid
				container
				spacing={3}>
				{/* Contact Information */}
				<Grid
					xs={12}
					md={4}>
					<Paper sx={{ p: 3, height: '100%' }}>
						<Typography
							variant='h6'
							gutterBottom
							sx={{ mb: 2 }}>
							Contact Info
						</Typography>
						<Divider sx={{ mb: 2 }} />
						{infoItem(<PhoneIcon />, 'Phone Number', phone)}
						{infoItem(<EmailIcon />, 'Email Address', email)}
						{infoItem(<LocationOnIcon />, 'Address', address)}

						<Typography
							variant='caption'
							color='text.secondary'
							sx={{ mt: 2, display: 'block' }}>
							Created At: {new Date(createdAt).toLocaleDateString()}
						</Typography>
					</Paper>
				</Grid>

				{/* Financial Summary */}
				<Grid
					xs={12}
					md={8}>
					<Paper sx={{ p: 3, height: '100%' }}>
						<Typography
							variant='h6'
							gutterBottom
							sx={{ mb: 2 }}>
							Financial Summary
						</Typography>
						<Divider sx={{ mb: 3 }} />

						<Grid
							container
							spacing={2}>
							<Grid
								xs={6}
								sm={3}>
								{statCard('Total Spent', totalSpent, 'primary')}
							</Grid>
							<Grid
								xs={6}
								sm={3}>
								{statCard('Total Due', totalDue, 'error')}
							</Grid>
							<Grid
								xs={6}
								sm={3}>
								{statCard('Wallet Balance', walletBalance, 'success')}
							</Grid>
							<Grid
								xs={6}
								sm={3}>
								{statCard('Credit Limit', creditLimit, 'warning')}
							</Grid>
						</Grid>

						<Box sx={{ mt: 4 }}>
							<Typography
								variant='subtitle2'
								gutterBottom
								color='text.secondary'>
								Internal Note
							</Typography>
							<Paper
								variant='outlined'
								sx={{ p: 2, bgcolor: 'grey.50', minHeight: '80px' }}>
								<Typography variant='body2'>
									{note || 'No internal notes added for this customer.'}
								</Typography>
							</Paper>
						</Box>
					</Paper>
				</Grid>

				{/* Placeholder for Transactions/Orders */}
				<Grid xs={12}>
					<Paper sx={{ p: 3 }}>
						<Stack
							direction='row'
							spacing={1}
							sx={{ mb: 2 }}>
							<HistoryIcon color='action' />
							<Typography variant='h6'>Recent Activity</Typography>
						</Stack>
						<Divider />
						<Box sx={{ py: 4, textAlign: 'center' }}>
							<Typography color='text.secondary'>
								Transaction history and Order list will be displayed here.
							</Typography>
						</Box>
					</Paper>
				</Grid>
			</Grid>
		</Box>
	);
};

export default CustomerDetailsPage;
