import {
	Box,
	Typography,
	Paper,
	Grid,
	Avatar,
	Chip,
	Stack,
	Divider,
	Button,
	Breadcrumbs,
	Link as MuiLink,
} from '@mui/material';
import {
	Person as PersonIcon,
	Phone as PhoneIcon,
	Email as EmailIcon,
	LocationOn as LocationIcon,
	AccountBalanceWallet as WalletIcon,
	CreditCard as CreditCardIcon,
	ShoppingCart as ShoppingCartIcon,
	AccessTime as TimeIcon,
	Business as BusinessIcon,
	ArrowBack as ArrowBackIcon,
	Edit as EditIcon,
} from '@mui/icons-material';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import getCustomerById from '../api/customers_api/getCustomerById';

// DetailItem component - extracted outside to avoid render-time creation
const DetailItem = ({ icon, label, value, color = 'text.primary' }) => (
	<Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1.5 }}>
		<Box
			sx={{
				color: 'primary.main',
				minWidth: 32,
				display: 'flex',
				alignItems: 'center',
			}}>
			{icon}
		</Box>
		<Box sx={{ flex: 1 }}>
			<Typography
				variant='body2'
				color='text.secondary'
				sx={{ mb: 0.5, fontWeight: 500 }}>
				{label}
			</Typography>
			<Typography
				variant='body1'
				color={color}
				fontWeight={600}
				sx={{ wordBreak: 'break-word' }}>
				{value}
			</Typography>
		</Box>
	</Box>
);

const CustomerDetailsPage = () => {
	const { id } = useParams();
	const navigate = useNavigate();

	const {
		data: customer,
		isLoading,
		isError,
	} = useQuery({
		queryKey: ['customer', id],
		queryFn: () => getCustomerById(id),
		enabled: !!id,
	});

	const formatCurrency = (amount) => {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'BDT',
		}).format(amount);
	};

	const formatDate = (dateString) => {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		});
	};

	const getCustomerTypeColor = (type) => {
		switch (type) {
			case 'VIP':
				return 'warning';
			case 'WHOLESALE':
				return 'info';
			case 'REGULAR':
			default:
				return 'default';
		}
	};

	if (isLoading) {
		return (
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					minHeight: '60vh',
				}}>
				<Typography
					variant='h6'
					color='text.secondary'>
					Loading customer details...
				</Typography>
			</Box>
		);
	}

	if (isError || !customer) {
		toast.error('Failed to load customer details');
		return (
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					minHeight: '60vh',
				}}>
				<Typography
					variant='h6'
					color='error'>
					Customer not found
				</Typography>
			</Box>
		);
	}

	return (
		<Box sx={{ p: 3, maxWidth: '1200px', mx: 'auto' }}>
			{/* Breadcrumbs */}
			<Breadcrumbs sx={{ mb: 3 }}>
				<MuiLink
					component={Link}
					to='/dashboard'
					sx={{ textDecoration: 'none', color: 'text.secondary' }}>
					Dashboard
				</MuiLink>
				<MuiLink
					component={Link}
					to='/customers'
					sx={{ textDecoration: 'none', color: 'text.secondary' }}>
					Customers
				</MuiLink>
				<Typography
					color='text.primary'
					fontWeight={500}>
					{customer.name}
				</Typography>
			</Breadcrumbs>

			{/* Header Section */}
			<Paper
				elevation={2}
				sx={{
					p: 4,
					mb: 3,
					borderRadius: 3,
					background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
					color: 'white',
				}}>
				<Box
					sx={{
						display: 'flex',
						alignItems: 'center',
						gap: 3,
						flexWrap: 'wrap',
					}}>
					<Avatar
						sx={{
							width: 80,
							height: 80,
							backgroundColor: 'rgba(255, 255, 255, 0.2)',
							backdropFilter: 'blur(10px)',
							border: '3px solid rgba(255, 255, 255, 0.3)',
						}}>
						<PersonIcon sx={{ fontSize: 40 }} />
					</Avatar>
					<Box sx={{ flex: 1, minWidth: 200 }}>
						<Typography
							variant='h4'
							fontWeight={700}
							sx={{ mb: 1, color: 'white' }}>
							{customer.name}
						</Typography>
						<Stack
							direction='row'
							spacing={2}
							alignItems='center'
							flexWrap='wrap'>
							<Chip
								label={customer.customerType}
								color={getCustomerTypeColor(customer.customerType)}
								size='small'
								sx={{
									color: 'white',
									borderColor: 'rgba(255, 255, 255, 0.3)',
									'& .MuiChip-label': { color: 'white' },
								}}
								variant='outlined'
							/>
							<Chip
								label={customer.isActive ? 'Active' : 'Inactive'}
								color={customer.isActive ? 'success' : 'error'}
								size='small'
								sx={{
									color: 'white',
									borderColor: 'rgba(255, 255, 255, 0.3)',
									'& .MuiChip-label': { color: 'white' },
								}}
								variant='outlined'
							/>
						</Stack>
					</Box>
					<Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
						<Button
							variant='outlined'
							startIcon={<ArrowBackIcon />}
							onClick={() => navigate('/customers')}
							sx={{
								color: 'white',
								borderColor: 'rgba(255, 255, 255, 0.3)',
								'&:hover': {
									borderColor: 'white',
									backgroundColor: 'rgba(255, 255, 255, 0.1)',
								},
							}}>
							Back to Customers
						</Button>
						<Button
							variant='contained'
							startIcon={<EditIcon />}
							sx={{
								backgroundColor: 'rgba(255, 255, 255, 0.2)',
								backdropFilter: 'blur(10px)',
								border: '1px solid rgba(255, 255, 255, 0.3)',
								'&:hover': {
									backgroundColor: 'rgba(255, 255, 255, 0.3)',
								},
							}}>
							Edit Customer
						</Button>
					</Box>
				</Box>
			</Paper>

			{/* Details Grid */}
			<Grid
				container
				spacing={3}>
				{/* Basic Information */}
				<Grid
					item
					xs={12}
					md={6}>
					<Paper
						elevation={1}
						sx={{
							p: 3,
							borderRadius: 3,
							height: 'fit-content',
						}}>
						<Typography
							variant='h6'
							fontWeight={600}
							sx={{
								mb: 3,
								color: 'text.primary',
								display: 'flex',
								alignItems: 'center',
								gap: 1,
							}}>
							📋 Basic Information
						</Typography>

						<DetailItem
							icon={<PersonIcon />}
							label='Full Name'
							value={customer.name}
						/>

						<Divider sx={{ my: 2 }} />

						<DetailItem
							icon={<PhoneIcon />}
							label='Phone Number'
							value={customer.phone}
						/>

						<Divider sx={{ my: 2 }} />

						<DetailItem
							icon={<EmailIcon />}
							label='Email Address'
							value={customer.email || 'Not provided'}
						/>

						{customer.address && (
							<>
								<Divider sx={{ my: 2 }} />
								<DetailItem
									icon={<LocationIcon />}
									label='Address'
									value={customer.address}
								/>
							</>
						)}

						{customer.note && (
							<>
								<Divider sx={{ my: 2 }} />
								<DetailItem
									icon={<BusinessIcon />}
									label='Notes'
									value={customer.note}
								/>
							</>
						)}
					</Paper>
				</Grid>

				{/* Financial Information */}
				<Grid
					item
					xs={12}
					md={6}>
					<Paper
						elevation={1}
						sx={{
							p: 3,
							borderRadius: 3,
							height: 'fit-content',
						}}>
						<Typography
							variant='h6'
							fontWeight={600}
							sx={{
								mb: 3,
								color: 'text.primary',
								display: 'flex',
								alignItems: 'center',
								gap: 1,
							}}>
							💰 Financial Information
						</Typography>

						<DetailItem
							icon={<WalletIcon />}
							label='Wallet Balance'
							value={formatCurrency(customer.walletBalance)}
							color={
								customer.walletBalance >= 0 ? 'success.main' : 'error.main'
							}
						/>

						<Divider sx={{ my: 2 }} />

						<DetailItem
							icon={<CreditCardIcon />}
							label='Credit Limit'
							value={formatCurrency(customer.creditLimit)}
							color='info.main'
						/>

						<Divider sx={{ my: 2 }} />

						<DetailItem
							icon={<CreditCardIcon />}
							label='Total Due'
							value={formatCurrency(customer.totalDue)}
							color={customer.totalDue > 0 ? 'error.main' : 'success.main'}
						/>

						<Divider sx={{ my: 2 }} />

						<DetailItem
							icon={<ShoppingCartIcon />}
							label='Total Spent'
							value={formatCurrency(customer.totalSpent)}
							color='info.main'
						/>

						<Divider sx={{ my: 2 }} />

						<DetailItem
							icon={<ShoppingCartIcon />}
							label='Total Orders'
							value={customer._count?.orders || 0}
							color='primary.main'
						/>
					</Paper>
				</Grid>

				{/* Account Information */}
				<Grid
					item
					xs={12}>
					<Paper
						elevation={1}
						sx={{
							p: 3,
							borderRadius: 3,
						}}>
						<Typography
							variant='h6'
							fontWeight={600}
							sx={{
								mb: 3,
								color: 'text.primary',
								display: 'flex',
								alignItems: 'center',
								gap: 1,
							}}>
							⚙️ Account Information
						</Typography>

						<Grid
							container
							spacing={3}>
							<Grid
								item
								xs={12}
								sm={6}
								md={3}>
								<DetailItem
									icon={<BusinessIcon />}
									label='Customer Type'
									value={customer.customerType}
									color='primary.main'
								/>
							</Grid>
							<Grid
								item
								xs={12}
								sm={6}
								md={3}>
								<DetailItem
									icon={<PersonIcon />}
									label='Status'
									value={customer.isActive ? 'Active' : 'Inactive'}
									color={customer.isActive ? 'success.main' : 'error.main'}
								/>
							</Grid>
							<Grid
								item
								xs={12}
								sm={6}
								md={3}>
								<DetailItem
									icon={<TimeIcon />}
									label='Created At'
									value={formatDate(customer.createdAt)}
									color='text.secondary'
								/>
							</Grid>
							<Grid
								item
								xs={12}
								sm={6}
								md={3}>
								<DetailItem
									icon={<TimeIcon />}
									label='Last Updated'
									value={formatDate(customer.updatedAt)}
									color='text.secondary'
								/>
							</Grid>
						</Grid>
					</Paper>
				</Grid>
			</Grid>
		</Box>
	);
};

export default CustomerDetailsPage;
