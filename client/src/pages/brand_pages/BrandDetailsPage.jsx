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
	Description as DescriptionIcon,
	Image as ImageIcon,
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import getBrandById from '../../api/brands_api/getBrandById';

const BrandDetailsPage = () => {
	const navigate = useNavigate();
	const { id } = useParams();

	const { data: brandData } = useQuery({
		queryFn: () => getBrandById(id),
		queryKey: ['brands', id],
	});

	// Jodi data load hote thake ba na thake
	if (!brandData) return <Typography>Loading brand details...</Typography>;

	const { name, description, logo, isActive, createdAt, _count } =
		brandData.data;

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
					onClick={() => navigate(`/brands/edit/${id}`)}>
					Edit Brand
				</Button>
			</Stack>

			<Grid
				container
				spacing={3}>
				{/* Brand Information */}
				<Grid
					xs={12}
					md={6}>
					<Paper sx={{ p: 3, height: '100%' }}>
						<Typography
							variant='h6'
							gutterBottom
							sx={{ mb: 2 }}>
							Brand Information
						</Typography>
						<Divider sx={{ mb: 2 }} />
						{infoItem(<DescriptionIcon />, 'Description', description)}

						{logo && (
							<Box sx={{ mb: 2 }}>
								<Typography
									variant='caption'
									color='text.secondary'
									display='block'
									sx={{ mb: 1 }}>
									Logo
								</Typography>
								<Box
									component='img'
									src={logo}
									alt={`${name} logo`}
									sx={{
										maxWidth: '100px',
										maxHeight: '100px',
										borderRadius: 1,
										border: '1px solid',
										borderColor: 'divider',
									}}
								/>
							</Box>
						)}

						<Typography
							variant='caption'
							color='text.secondary'
							sx={{ mt: 2, display: 'block' }}>
							Created At: {new Date(createdAt).toLocaleDateString()}
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
								{statCard('Total Products', _count?.products || 0, 'primary')}
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

				{/* Associated Products */}
				<Grid xs={12}>
					<Paper sx={{ p: 3 }}>
						<Stack
							direction='row'
							spacing={1}
							sx={{ mb: 2 }}>
							<InventoryIcon color='action' />
							<Typography variant='h6'>Associated Products</Typography>
						</Stack>
						<Divider />
						<Box sx={{ py: 4, textAlign: 'center' }}>
							<Typography color='text.secondary'>
								Product list associated with this brand will be displayed here.
							</Typography>
						</Box>
					</Paper>
				</Grid>
			</Grid>
		</Box>
	);
};

export default BrandDetailsPage;
