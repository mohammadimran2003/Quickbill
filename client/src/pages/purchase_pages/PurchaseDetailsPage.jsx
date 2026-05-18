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
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
} from '@mui/material';
import {
	ArrowBack as ArrowBackIcon,
	Edit as EditIcon,
	Person as PersonIcon,
	Phone as PhoneIcon,
	Receipt as ReceiptIcon,
	Payment as PaymentIcon,
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import getPurchaseById from '../../api/purchases_api/getPurchaseById';

const PurchaseDetailsPage = () => {
	const navigate = useNavigate();
	const { id } = useParams();

	const { data: purchaseData, isLoading } = useQuery({
		queryFn: () => getPurchaseById(id),
		queryKey: ['purchase', id],
	});

	if (isLoading) return <Box sx={{ p: 3 }}><CircularProgress /></Box>;
	if (!purchaseData || !purchaseData.data) return <Box sx={{ p: 3 }}><Typography>Purchase not found...</Typography></Box>;

	const purchase = purchaseData.data;
	const { 
		purchaseNumber, 
		supplier, 
		items, 
		subTotal, 
		total, 
		paidAmount, 
		dueAmount, 
		status, 
		paymentMethod, 
		note, 
		createdAt 
	} = purchase;

	const getStatusColor = (status) => {
		switch(status) {
			case 'RECEIVED': return 'success';
			case 'ORDERED': return 'warning';
			case 'CANCELLED': return 'error';
			default: return 'default';
		}
	}

	const infoItem = (icon, label, value) => (
		<Stack direction='row' spacing={2} sx={{ mb: 2 }}>
			<Box sx={{ color: 'primary.main', display: 'flex' }}>{icon}</Box>
			<Box>
				<Typography variant='caption' color='text.secondary' display='block'>
					{label}
				</Typography>
				<Typography variant='body1' fontWeight={500}>
					{value || 'N/A'}
				</Typography>
			</Box>
		</Stack>
	);

	return (
		<Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
			{/* Header Section */}
			<Stack direction='row' sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
				<Stack direction='row' spacing={2}>
					<IconButton onClick={() => navigate(-1)} color='primary'>
						<ArrowBackIcon />
					</IconButton>
					<Box>
						<Typography variant='h5' fontWeight='bold'>
							{purchaseNumber}
						</Typography>
						<Stack direction='row' spacing={1}>
							<Chip label={status} size='small' color={getStatusColor(status)} variant='outlined' />
							<Chip label={paymentMethod} size='small' color="secondary" variant='outlined' />
						</Stack>
					</Box>
				</Stack>
				<Button variant='contained' startIcon={<EditIcon />} onClick={() => navigate(`/purchases/edit-purchase/${id}`)}>
					Edit Purchase
				</Button>
			</Stack>

			<Grid container spacing={3}>
				{/* Supplier Information */}
				<Grid item xs={12} md={6}>
					<Paper sx={{ p: 3, height: '100%' }}>
						<Typography variant='h6' gutterBottom sx={{ mb: 2 }}>
							Supplier Information
						</Typography>
						<Divider sx={{ mb: 2 }} />
						
						{supplier ? (
							<>
								{infoItem(<PersonIcon />, 'Name', supplier.name)}
								{infoItem(<PhoneIcon />, 'Phone', supplier.phone)}
								<Button variant="text" size="small" onClick={() => navigate(`/suppliers/${supplier.id}`)}>
									View Full Profile
								</Button>
							</>
						) : (
							<Typography variant="body2" color="text.secondary">Walk-in / No Supplier Selected</Typography>
						)}
					</Paper>
				</Grid>

				{/* Purchase Summary */}
				<Grid item xs={12} md={6}>
					<Paper sx={{ p: 3, height: '100%' }}>
						<Typography variant='h6' gutterBottom sx={{ mb: 2 }}>
							Payment Summary
						</Typography>
						<Divider sx={{ mb: 3 }} />

						<Stack spacing={2}>
							<Stack direction="row" justifyContent="space-between">
								<Typography color="text.secondary">Subtotal</Typography>
								<Typography fontWeight={500}>${subTotal?.toFixed(2)}</Typography>
							</Stack>
							<Stack direction="row" justifyContent="space-between">
								<Typography color="text.secondary">Total</Typography>
								<Typography fontWeight={600} variant="subtitle1">${total?.toFixed(2)}</Typography>
							</Stack>
							<Divider />
							<Stack direction="row" justifyContent="space-between">
								<Typography color="text.secondary">Paid Amount</Typography>
								<Typography fontWeight={500} color="success.main">${paidAmount?.toFixed(2)}</Typography>
							</Stack>
							<Stack direction="row" justifyContent="space-between">
								<Typography color="text.secondary">Due Amount</Typography>
								<Typography fontWeight={600} color={dueAmount > 0 ? "error.main" : "success.main"}>
									${dueAmount?.toFixed(2)}
								</Typography>
							</Stack>
						</Stack>

						<Typography variant='caption' color='text.secondary' sx={{ mt: 3, display: 'block' }}>
							Created At: {new Date(createdAt).toLocaleString()}
						</Typography>
					</Paper>
				</Grid>

				{/* Note */}
				{note && (
					<Grid item xs={12}>
						<Paper sx={{ p: 3 }}>
							<Typography variant='h6' gutterBottom>Note</Typography>
							<Divider sx={{ mb: 2 }} />
							<Typography variant="body2">{note}</Typography>
						</Paper>
					</Grid>
				)}

				{/* Purchase Items */}
				<Grid item xs={12}>
					<Paper sx={{ p: 3 }}>
						<Stack direction='row' spacing={1} sx={{ mb: 2 }}>
							<ReceiptIcon color='action' />
							<Typography variant='h6'>Line Items</Typography>
						</Stack>
						<Divider sx={{ mb: 2 }} />
						
						<TableContainer variant="outlined">
							<Table size="small">
								<TableHead sx={{ bgcolor: 'action.hover' }}>
									<TableRow>
										<TableCell>#</TableCell>
										<TableCell>Product Name</TableCell>
										<TableCell align="right">Quantity</TableCell>
										<TableCell align="right">Unit Cost</TableCell>
										<TableCell align="right">Total</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{items?.map((item, index) => (
										<TableRow key={item.id || index}>
											<TableCell>{index + 1}</TableCell>
											<TableCell>{item.productName}</TableCell>
											<TableCell align="right">{item.quantity}</TableCell>
											<TableCell align="right">${item.unitCost?.toFixed(2)}</TableCell>
											<TableCell align="right" sx={{ fontWeight: 500 }}>${item.total?.toFixed(2)}</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</TableContainer>
					</Paper>
				</Grid>
			</Grid>
		</Box>
	);
};

export default PurchaseDetailsPage;
