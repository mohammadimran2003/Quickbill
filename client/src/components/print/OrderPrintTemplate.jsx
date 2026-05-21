import React from 'react';
import {
	Box,
	Typography,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Divider,
	Stack,
	Grid,
} from '@mui/material';

export const OrderPrintTemplate = React.forwardRef(({ order }, ref) => {
	if (!order) return null;

	return (
		<Box
			ref={ref}
			sx={{ p: 4, bgcolor: 'white', color: 'black' }}>
			{/* Header */}
			<Stack
				sx={{
					mb: 4,
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					flexDirection: 'column',
				}}>
				<Box>
					<Typography
						variant='h4'
						fontWeight='bold'>
						INVOICE
					</Typography>
					<Typography variant='body1'>Order #{order.orderNumber}</Typography>
				</Box>
				<Box sx={{ textAlign: 'center' }}>
					<Typography
						variant='h6'
						fontWeight='bold'>
						Quickbill
					</Typography>
					<Typography variant='body2'>
						Seedstore, Bhaluka, Mymensingh
					</Typography>
					<Typography variant='body2'>Phone: +8801797473211</Typography>
				</Box>
			</Stack>

			<Divider sx={{ mb: 3 }} />

			{/* Customer & Order Info */}
			<Grid
				container
				spacing={2}
				sx={{ mb: 4, display: 'flex', justifyContent: 'space-between' }}>
				<Grid>
					<Typography
						variant='subtitle2'
						color='textSecondary'>
						Bill To:
					</Typography>
					<Typography
						variant='body1'
						fontWeight='bold'>
						{order.customerName || 'Walk-in Customer'}
					</Typography>
					<Typography variant='body2'>
						Customer ID: {order.customerId || 'N/A'}
					</Typography>
				</Grid>
				<Grid sx={{ textAlign: 'right' }}>
					<Typography
						variant='subtitle2'
						color='textSecondary'>
						Date:
					</Typography>
					<Typography variant='body1'>
						{new Date(order.createdAt).toLocaleDateString('en-GB')}
					</Typography>
					<Typography
						variant='subtitle2'
						color='textSecondary'
						sx={{ mt: 1 }}>
						Payment Method:
					</Typography>
					<Typography variant='body1'>{order.paymentMethod}</Typography>
				</Grid>
			</Grid>

			{/* Items Table */}
			<TableContainer sx={{ mb: 4 }}>
				<Table size='small'>
					<TableHead>
						<TableRow>
							<TableCell
								sx={{ fontWeight: 'bold', borderBottom: '2px solid black' }}>
								Product
							</TableCell>
							<TableCell
								align='center'
								sx={{ fontWeight: 'bold', borderBottom: '2px solid black' }}>
								Qty
							</TableCell>
							<TableCell
								align='center'
								sx={{ fontWeight: 'bold', borderBottom: '2px solid black' }}>
								Price
							</TableCell>
							<TableCell
								align='right'
								sx={{ fontWeight: 'bold', borderBottom: '2px solid black' }}>
								Total
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{order?.items?.map((item) => (
							<TableRow key={item.id}>
								<TableCell>{item.productName}</TableCell>
								<TableCell align='center'>{item.quantity}</TableCell>
								<TableCell align='center'>৳{item.unitPrice}</TableCell>
								<TableCell align='right'>৳{item.total}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>

			{/* Summary */}
			<Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
				<Stack
					spacing={1}
					sx={{ width: '250px' }}>
					<Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
						<Typography>Subtotal:</Typography>
						<Typography>৳{order.subtotal}</Typography>
					</Box>
					<Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
						<Typography>Discount:</Typography>
						<Typography>- ৳{order.discountAmount}</Typography>
					</Box>
					<Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
						<Typography>Tax:</Typography>
						<Typography>+ ৳{order.taxAmount}</Typography>
					</Box>
					<Divider />
					<Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
						<Typography
							variant='h6'
							fontWeight='bold'>
							Total:
						</Typography>
						<Typography
							variant='h6'
							fontWeight='bold'>
							৳{order.total}
						</Typography>
					</Box>
					<Divider />
					<Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
						<Typography variant='body2'>Paid:</Typography>
						<Typography variant='body2'>৳{order.amountPaid}</Typography>
					</Box>
					<Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
						<Typography variant='body2'>Due:</Typography>
						<Typography
							variant='body2'
							color={order.dueAmount > 0 ? 'error' : 'inherit'}>
							৳{order.dueAmount}
						</Typography>
					</Box>
				</Stack>
			</Box>

			{/* Footer */}
			<Box
				sx={{ mt: 8, textAlign: 'center', borderTop: '1px solid #eee', pt: 2 }}>
				<Typography
					variant='body2'
					color='textSecondary'>
					Thank you for your business!
				</Typography>
			</Box>
		</Box>
	);
});
