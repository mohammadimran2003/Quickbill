import React, { useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import {
	Box,
	Container,
	Grid,
	Paper,
	Typography,
	Stack,
	IconButton,
	Button,
	Divider,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Chip,
	CircularProgress,
	Tooltip,
} from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import EditIcon from '@mui/icons-material/Edit';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonIcon from '@mui/icons-material/Person';
import PaymentIcon from '@mui/icons-material/Payment';
import getOrderById from '../../api/orders_api/getOrderById';
import { useReactToPrint } from 'react-to-print';
import { OrderPrintTemplate } from '../../components/orders_comp/OrderPrintTemplate';

const OrderDetailsPage = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const printRef = useRef();

	const { data, isLoading, isError, error } = useQuery({
		queryKey: ['order', id],
		queryFn: () => getOrderById(id),
	});
	const order = data?.data;

	const handlePrint = useReactToPrint({
		contentRef: printRef,
		documentTitle: `Order_Details`,
	});

	if (isLoading)
		return (
			<Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
				<CircularProgress />
			</Box>
		);

	if (isError)
		return <Typography color='error'>Error: {error.message}</Typography>;

	return (
		<Container
			maxWidth={false}
			sx={{ maxWidth: 1400, py: 4 }}>
			<Box
				sx={{
					mb: 4,
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'flex-start',
				}}>
				<Stack spacing={1}>
					<Typography
						variant='h4'
						fontWeight='bold'
						color='primary'>
						Order #{order?.orderNumber}
					</Typography>
					<Stack
						direction='row'
						spacing={2}
						color='text.secondary'>
						<Stack
							direction='row'
							spacing={1}>
							<CalendarTodayIcon fontSize='small' />
							<Typography variant='body2'>
								{new Date(order?.createdAt).toLocaleDateString('en-GB', {
									day: 'numeric',
									month: 'long',
									year: 'numeric',
									hour: '2-digit',
									minute: '2-digit',
								})}
							</Typography>
						</Stack>
						<Chip
							label={order?.status}
							color={order?.status === 'COMPLETED' ? 'success' : 'warning'}
							size='small'
						/>
						<Chip
							label={order?.orderType}
							variant='outlined'
							size='small'
						/>
					</Stack>
				</Stack>

				<Stack
					direction='row'
					spacing={2}>
					<Tooltip title='Print Invoice'>
						<Button
							variant='outlined'
							startIcon={<PrintIcon />}
							onClick={handlePrint}>
							Print
						</Button>
					</Tooltip>
					<Button
						variant='contained'
						startIcon={<EditIcon />}
						onClick={() => navigate(`/orders/edit/${id}`)}>
						Edit Order
					</Button>
				</Stack>
			</Box>

			<Grid
				container
				spacing={3}>
				{/* Left Side: Order Items Table */}
				<Grid size={8}>
					<TableContainer
						component={Paper}
						elevation={2}
						sx={{ borderRadius: 2 }}>
						<Box sx={{ p: 2 }}>
							<Typography
								variant='h6'
								fontWeight='bold'>
								Order Items
							</Typography>
						</Box>
						<Table sx={{ minWidth: 650 }}>
							<TableHead sx={{ bgcolor: 'action.hover' }}>
								<TableRow>
									<TableCell sx={{ fontWeight: 'bold' }}>
										Product Name
									</TableCell>
									<TableCell
										align='center'
										sx={{ fontWeight: 'bold' }}>
										Price
									</TableCell>
									<TableCell
										align='center'
										sx={{ fontWeight: 'bold' }}>
										Qty
									</TableCell>
									<TableCell
										align='center'
										sx={{ fontWeight: 'bold' }}>
										Discount
									</TableCell>
									<TableCell
										align='right'
										sx={{ fontWeight: 'bold' }}>
										Total
									</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{order?.items?.map((item) => (
									<TableRow
										key={item.id}
										hover>
										<TableCell>{item.productName}</TableCell>
										<TableCell align='center'>৳{item.unitPrice}</TableCell>
										<TableCell align='center'>{item.quantity}</TableCell>
										<TableCell align='center'>৳{item.discount}</TableCell>
										<TableCell
											align='right'
											sx={{ fontWeight: 'bold' }}>
											৳{item.total}
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</TableContainer>

					{order?.note && (
						<Paper
							elevation={0}
							sx={{
								p: 2,
								mt: 3,
								bgcolor: 'grey.50',
								border: '1px dashed grey',
							}}>
							<Typography
								variant='subtitle2'
								fontWeight='bold'>
								Note:
							</Typography>
							<Typography variant='body2'>{order.note}</Typography>
						</Paper>
					)}
				</Grid>

				{/* Right Side: Order Summary & Customer Info */}
				<Grid size={4}>
					<Stack spacing={3}>
						{/* Summary Card */}
						<Paper
							elevation={2}
							sx={{ p: 3, borderRadius: 2 }}>
							<Typography
								variant='h6'
								fontWeight='bold'
								gutterBottom>
								Summary
							</Typography>
							<Stack spacing={1.5}>
								<Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
									<Typography color='text.secondary'>Subtotal</Typography>
									<Typography fontWeight='medium'>
										৳{order?.subtotal}
									</Typography>
								</Box>
								<Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
									<Typography color='text.secondary'>
										Discount ({order?.discountType})
									</Typography>
									<Typography color='error.main'>
										- ৳{order?.discountAmount}
									</Typography>
								</Box>
								<Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
									<Typography color='text.secondary'>Tax</Typography>
									<Typography>+ ৳{order?.taxAmount}</Typography>
								</Box>
								<Divider />
								<Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
									<Typography
										variant='h6'
										fontWeight='bold'>
										Total
									</Typography>
									<Typography
										variant='h6'
										fontWeight='bold'
										color='primary'>
										৳{order?.total}
									</Typography>
								</Box>
							</Stack>
						</Paper>

						{/* Payment Status Card */}
						<Paper
							elevation={2}
							sx={{ p: 3, borderRadius: 2 }}>
							<Stack
								direction='row'
								spacing={1}
								mb={2}>
								<PaymentIcon color='action' />
								<Typography
									variant='h6'
									fontWeight='bold'>
									Payment Details
								</Typography>
							</Stack>
							<Stack spacing={1.5}>
								<Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
									<Typography color='text.secondary'>Method</Typography>
									<Chip
										label={order?.paymentMethod}
										size='small'
										variant='outlined'
									/>
								</Box>
								<Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
									<Typography color='text.secondary'>Paid Amount</Typography>
									<Typography
										color='success.main'
										fontWeight='bold'>
										৳{order?.amountPaid}
									</Typography>
								</Box>
								<Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
									<Typography color='text.secondary'>Due Amount</Typography>
									<Typography
										color={
											order?.dueAmount > 0 ? 'error.main' : 'text.primary'
										}>
										৳{order?.dueAmount}
									</Typography>
								</Box>
								{order?.changeAmount > 0 && (
									<Box
										sx={{ display: 'flex', justifyContent: 'space-between' }}>
										<Typography color='text.secondary'>Change</Typography>
										<Typography>৳{order?.changeAmount}</Typography>
									</Box>
								)}
							</Stack>
						</Paper>

						{/* Customer Info Card */}
						<Paper
							elevation={2}
							sx={{ p: 3, borderRadius: 2 }}>
							<Stack
								direction='row'
								spacing={1}
								mb={2}>
								<PersonIcon color='action' />
								<Typography
									variant='h6'
									fontWeight='bold'>
									Customer Info
								</Typography>
							</Stack>
							<Typography
								variant='body1'
								fontWeight='medium'>
								{order?.customerName || 'Walk-in Customer'}
							</Typography>
							<Typography
								variant='body2'
								color='text.secondary'>
								ID: {order?.customerId || 'N/A'}
							</Typography>
						</Paper>
					</Stack>
				</Grid>
			</Grid>

			<Box sx={{ display: 'none' }}>
				<OrderPrintTemplate
					ref={printRef}
					order={order}
				/>
			</Box>
		</Container>
	);
};

export default OrderDetailsPage;
