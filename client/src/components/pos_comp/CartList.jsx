import React, { useEffect, useRef, useState } from 'react';
import useCartStore from '../../store/cartStore';
import {
	Box,
	Typography,
	IconButton,
	Button,
	Divider,
	Paper,
	Stack,
	Autocomplete,
	TextField,
} from '@mui/material';

import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import { useQuery, useMutation } from '@tanstack/react-query';
import getCustomers from '../../api/customers_api/getCustomers';
import CartItem from './CartItem';
import DiscountModal from './DiscountModal';
import CustomerModal from '../customers_comp/CustomerModal';
import createCustomer from '../../api/customers_api/createCustomer';
import createOrder from '../../api/pos_api/createOrder';
import { toast } from 'sonner';
import { formatCurrency } from '../../utils/formatCurrency';
import { OrderPrintTemplate } from '../shared/OrderPrintTemplate';
import { useReactToPrint } from 'react-to-print';
import getCustomerByPhone from '../../api/orders_api/getCustomerByPhone';

function CartList() {
	const {
		items,
		updateQuantity,
		removeItem,
		clearCart,
		discountType,
		discountValue,
	} = useCartStore();
	const [openDiscountModal, setOpenDiscountModal] = useState(false);

	const [paymentMethod, setPaymentMethod] = useState('CASH');
	const [amountPaid, setAmountPaid] = useState('');
	const [selectedCustomer, setSelectedCustomer] = useState(null);
	const [openCustomerModal, setOpenCustomerModal] = useState(false);
	const [order, setOrder] = useState(null);
	const printRef = useRef();
	const handlePrint = useReactToPrint({
		contentRef: printRef,
		documentTitle: `Order_Details`,
	});

	const { data: walkInCustomer } = useQuery({
		queryKey: ['walk-in-customer'],
		queryFn: () => getCustomerByPhone('walk-in'),
		staleTime: Infinity,
	});

	useEffect(() => {
		if (walkInCustomer?.data) {
			setSelectedCustomer(walkInCustomer.data);
		}
	}, [walkInCustomer]);

	const paymentMethods = ['CASH', 'CARD', 'MOBILE_BANKING', 'UNPAID'];

	const { data: customerData, refetch } = useQuery({
		queryKey: ['customers'],
		queryFn: () => getCustomers(),
	});

	const { mutate } = useMutation({
		mutationFn: (customer) => createCustomer(customer),
		onSuccess: () => {
			refetch();
			setOpenCustomerModal(false);
		},
		onError: (err) => {
			console.log(err);
		},
	});

	const customers = customerData?.data || customerData || [];

	//handler function
	const handleOpenDiscount = () => {
		setOpenDiscountModal(true);
	};

	const handleCreateCustomerSubmit = (data) => {
		mutate(data);
		setOpenCustomerModal(false);
	};

	const handleOpenCustomerModal = () => {
		setOpenCustomerModal(true);
	};
	const handleCloseCustomerModal = () => {
		setOpenCustomerModal(false);
	};

	const handleCreateOrder = async () => {
		try {
			const orderData = {
				items: items.map((item) => ({
					productId: item.id,
					quantity: item.quantity,
					discount: item.discount || 0,
				})),
				discountType,
				discountValue,
				customerId: selectedCustomer?.id,
				paymentMethod,
				amountPaid: paymentMethod === 'UNPAID' ? 0 : Number(amountPaid),
			};

			const response = await toast.promise(createOrder(orderData), {
				loading: 'Creating order...',
				success: 'Order created successfully',

				error: (err) => err.message || 'Something went wrong',
			});

			console.log(response, 'response');

			if (response?.success) {
				setOrder(response?.data);
				setTimeout(() => handlePrint(), 100);
				clearCart();
				setPaymentMethod('CASH');
				setAmountPaid('');
				setSelectedCustomer(null);
			}
		} catch (err) {
			console.log('Order creation failed:', err.message);
		}
	};

	//derived state;
	const subTotal = items.reduce(
		(total, item) => total + item.basePrice * item.quantity,
		0,
	);
	const discount =
		discountType === 'PERCENT' ?
			(subTotal * discountValue) / 100
		:	discountValue;

	const total = subTotal - discount;
	const numericPaid = Number(amountPaid);
	const changeAmount = numericPaid > total ? numericPaid - total : 0;

	return (
		<Paper
			elevation={2}
			sx={{
				height: 'calc(100vh - 120px)',
				display: 'flex',
				flexDirection: 'column',
				bgcolor: 'background.paper',
				borderRadius: 2,
				overflow: 'hidden',
			}}>
			{/* Cart Header */}
			<Box
				sx={{
					p: 2,
					bgcolor: 'primary.main',
					color: 'primary.contrastText',
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
				}}>
				<Typography
					variant='h6'
					sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
					<ShoppingCartOutlinedIcon />
					Current Order
				</Typography>
				<Typography
					variant='subtitle1'
					fontWeight='bold'>
					{items.length} {items.length === 1 ? 'Item' : 'Items'}
				</Typography>
			</Box>

			{/* Cart Items List */}
			<Box sx={{ flexGrow: 1, overflowY: 'auto', p: 1 }}>
				{items.length === 0 ?
					<Box
						sx={{
							height: '100%',
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							justifyContent: 'center',
							color: 'text.secondary',
							opacity: 0.7,
						}}>
						<ShoppingCartOutlinedIcon sx={{ fontSize: 60, mb: 2 }} />
						<Typography variant='h6'>Cart is empty</Typography>
						<Typography variant='body2'>
							Add products to start an order
						</Typography>
					</Box>
				:	<CartItem
						items={items}
						updateQuantity={updateQuantity}
						removeItem={removeItem}
					/>
				}
			</Box>

			{/* Cart Footer / Totals */}
			<Box
				sx={{
					p: 2,
					borderTop: '1px solid',
					borderColor: 'divider',
					bgcolor: 'background.paper',
				}}>
				<Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
					<Typography
						variant='body2'
						color='text.secondary'>
						Subtotal
					</Typography>
					<Typography
						variant='body2'
						fontWeight='bold'>
						{formatCurrency(subTotal)}
					</Typography>
				</Box>

				<Box
					sx={{
						display: 'flex',
						justifyContent: 'space-between',
						mb: 2,
						alignItems: 'center',
					}}>
					<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
						<Typography
							variant='body2'
							color='text.secondary'>
							Discount{' '}
							{discountValue > 0 &&
								`(${discountType === 'PERCENT' ? `${discountValue}%` : `৳${discountValue}`})`}
						</Typography>
						<IconButton
							size='small'
							onClick={handleOpenDiscount}
							color='primary'
							sx={{ p: 0.5 }}>
							<LocalOfferOutlinedIcon fontSize='small' />
						</IconButton>
					</Box>
					<Typography
						variant='body2'
						fontWeight='bold'
						color='success.main'>
						- {formatCurrency(discount)}
					</Typography>
				</Box>
				<Divider sx={{ my: 1.5 }} />
				<Box
					sx={{
						display: 'flex',
						justifyContent: 'space-between',
						mb: 2.5,
						alignItems: 'center',
					}}>
					<Typography
						variant='h6'
						fontWeight='bold'>
						Total
					</Typography>
					<Typography
						variant='h5'
						fontWeight='bold'
						color='primary.main'>
						{formatCurrency(total)}
					</Typography>
				</Box>

				<Box sx={{ mb: 2 }}>
					{/* Customer Search */}
					<Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
						<Autocomplete
							options={customers}
							getOptionLabel={(option) => option.name || ''}
							getOptionKey={(option) => option.id}
							value={selectedCustomer}
							onChange={(event, newValue) => setSelectedCustomer(newValue)}
							renderInput={(params) => (
								<TextField
									{...params}
									label='Search Customer'
									size='small'
									fullWidth
								/>
							)}
							sx={{ flexGrow: 1 }}
							size='small'
						/>
						<IconButton
							color='primary'
							onClick={handleOpenCustomerModal}
							sx={{
								border: '1px solid',
								borderColor: 'divider',
								borderRadius: 1,
								height: '40px',
								width: '40px',
							}}>
							<PersonAddAlt1Icon />
						</IconButton>
						<CustomerModal
							open={openCustomerModal}
							onClose={handleCloseCustomerModal}
							onSave={handleCreateCustomerSubmit}
						/>
					</Box>

					{/* Payment Methods */}
					<Stack
						direction='row'
						spacing={1}
						sx={{
							mb: 2,
							overflowX: 'auto',
							whiteSpace: 'nowrap',
							pb: 1,
							gap: 1,
						}}>
						{paymentMethods.map((method) => (
							<Button
								key={method}
								variant={paymentMethod === method ? 'contained' : 'outlined'}
								onClick={() => setPaymentMethod(method)}
								size='small'
								sx={{
									flexShrink: 0,
									fontSize: '0.75rem',
									py: 0.5,
									px: 2,
								}}>
								{method.replace('_', ' ')}
							</Button>
						))}
					</Stack>

					{/* Paid & Change */}
					{paymentMethod !== 'UNPAID' && (
						<Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
							<TextField
								label='Paid Amount'
								type='number'
								size='small'
								value={amountPaid}
								onChange={(e) => setAmountPaid(e.target.value)}
								sx={{ flexGrow: 1 }}
							/>
							<Box sx={{ minWidth: '80px', textAlign: 'right' }}>
								<Typography
									variant='caption'
									color='text.secondary'
									display='block'>
									Change
								</Typography>
								<Typography
									variant='subtitle1'
									fontWeight='bold'
									color={changeAmount > 0 ? 'success.main' : 'text.primary'}>
									{formatCurrency(changeAmount)}
								</Typography>
							</Box>
						</Box>
					)}
				</Box>

				<Box sx={{ display: 'flex', gap: 1.5 }}>
					<Button
						variant='outlined'
						color='error'
						onClick={clearCart}
						disabled={items.length === 0}
						sx={{ flex: 1, textTransform: 'none', fontWeight: 'bold' }}>
						Clear
					</Button>
					<Button
						variant='contained'
						color='primary'
						size='large'
						disabled={items.length === 0}
						sx={{ flex: 2, textTransform: 'none', fontWeight: 'bold' }}
						onClick={handleCreateOrder}>
						Pay Now
					</Button>
				</Box>
			</Box>

			{/* Discount Modal */}
			<DiscountModal
				open={openDiscountModal}
				setOpen={setOpenDiscountModal}
			/>

			<Box sx={{ display: 'none' }}>
				<OrderPrintTemplate
					ref={printRef}
					order={order}
				/>
			</Box>
		</Paper>
	);
}

export default CartList;
