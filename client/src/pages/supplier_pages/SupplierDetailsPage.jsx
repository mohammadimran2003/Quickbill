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
	Inventory as InventoryIcon,
	Phone as PhoneIcon,
	Email as EmailIcon,
	LocationOn as LocationOnIcon,
	Note as NoteIcon,
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import getSupplierById from '../../api/suppliers_api/getSupplierById';

const SupplierDetailsPage = () => {
	const navigate = useNavigate();
	const { id } = useParams();

	const { data: supplierData } = useQuery({
		queryFn: () => getSupplierById(id),
		queryKey: ['supplier', id],
	});

	if (!supplierData)
		return <Typography>Loading supplier details...</Typography>;

	const { name, phone, email, address, note, isActive, createdAt, _count } =
		supplierData.data;

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
				{value}
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
					onClick={() => navigate(`/suppliers/edit-supplier/${id}`)}>
					Edit Supplier
				</Button>
			</Stack>

			<Grid
				container
				spacing={3}>
				{/* Supplier Information */}
				<Grid
					xs={12}
					md={6}>
					<Paper sx={{ p: 3, height: '100%' }}>
						<Typography
							variant='h6'
							gutterBottom
							sx={{ mb: 2 }}>
							Supplier Information
						</Typography>
						<Divider sx={{ mb: 2 }} />

						{infoItem(<PhoneIcon />, 'Phone', phone)}
						{infoItem(<EmailIcon />, 'Email', email)}
						{infoItem(<LocationOnIcon />, 'Address', address)}
						{infoItem(<NoteIcon />, 'Note', note)}

						<Typography
							variant='caption'
							color='text.secondary'
							sx={{ mt: 2, display: 'block' }}>
							Created At:{' '}
							{createdAt ? new Date(createdAt).toLocaleDateString() : 'N/A'}
						</Typography>
					</Paper>
				</Grid>

				{/* Statistics */}
				<Grid
					xs={12}
					md={6}>
					<Paper sx={{ p: 3, height: '100%' }}>
						<Typography
							variant='h6'
							gutterBottom
							sx={{ mb: 2 }}>
							Statistics
						</Typography>
						<Divider sx={{ mb: 3 }} />

						<Grid
							container
							spacing={2}>
							<Grid
								xs={12}
								sm={6}>
								{statCard('Total Purchases', _count?.purchases || 0, 'primary')}
							</Grid>
							<Grid
								xs={12}
								sm={6}>
								{statCard(
									'Status',
									isActive ? 'Active' : 'Inactive',
									isActive ? 'success' : 'error',
								)}
							</Grid>
						</Grid>
					</Paper>
				</Grid>

				{/* Associated Purchases */}
				<Grid xs={12}>
					<Paper sx={{ p: 3 }}>
						<Stack
							direction='row'
							spacing={1}
							sx={{ mb: 2 }}>
							<InventoryIcon color='action' />
							<Typography variant='h6'>Recent Purchases</Typography>
						</Stack>
						<Divider />
						<Box sx={{ py: 4, textAlign: 'center' }}>
							<Typography color='text.secondary'>
								Purchase history from this supplier will be displayed here.
							</Typography>
						</Box>
					</Paper>
				</Grid>
			</Grid>
		</Box>
	);
};

export default SupplierDetailsPage;
