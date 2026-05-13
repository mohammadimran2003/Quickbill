import {
	Box,
	Button,
	Chip,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	IconButton,
	Stack,
	TextField,
	Typography,
	Tooltip,
	MenuItem,
} from '@mui/material';
import { useState } from 'react';
import SellIcon from '@mui/icons-material/Sell';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import createPriceTier from '../../api/priceTiers_api/createPriceTier';
import { toast } from 'sonner';
import deletePriceTier from '../../api/priceTiers_api/deletePriceTier';

const TIER_NAMES = ['RETAIL', 'WHOLESALE', 'VIP', 'SPECIAL'];

export default function PriceTierModal({ product }) {
	const [open, setOpen] = useState(false);
	const [showForm, setShowForm] = useState(false);

	const queryClient = useQueryClient();

	const { mutateAsync } = useMutation({
		mutationKey: ['priceTiers'],
		mutationFn: ({ productId, data }) => createPriceTier(productId, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['products'] });
		},
		onError: (err) => {
			toast.error(err.response?.data?.message || 'Something went wrong');
		},
	});

	const { mutateAsync: deleteMutateAsync } = useMutation({
		mutationKey: ['priceTiers'],
		mutationFn: ({ productId, priceTierId }) =>
			deletePriceTier(productId, priceTierId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['products'] });
		},
		onError: (err) => {
			toast.error(err.response?.data?.message || 'Something went wrong');
		},
	});
	// Form States
	const [formData, setFormData] = useState({
		name: 'RETAIL',
		minQty: 1,
		price: '',
	});

	const handleClickOpen = () => setOpen(true);
	const handleClose = () => {
		setOpen(false);
		setShowForm(false);
	};

	const handleAddTier = async () => {
		const formattedData = {
			productId: product.id,
			data: {
				...formData,
				minQty: Number(formData.minQty),
				price: Number(formData.price),
			},
		};

		await toast.promise(mutateAsync(formattedData), {
			loading: 'Creating price tier...',
			success: 'Price Tier created successfully',
			error: (err) => err?.response?.data?.message || 'Something went wrong',
		});
		setShowForm(false);
	};

	const handleDeletePriceTier = async (priceTierId) => {
		await toast.promise(
			deleteMutateAsync({ productId: product.id, priceTierId }),
			{
				loading: 'Deleting price tier...',
				success: 'Price Tier Deleted successfully',
				error: (err) => err?.response?.data?.message || 'Something went wrong',
			},
		);
	};

	return (
		<>
			<Tooltip title='Price Tier'>
				<IconButton
					size='small'
					color='primary'
					onClick={handleClickOpen}>
					<SellIcon fontSize='small' />
				</IconButton>
			</Tooltip>

			<Dialog
				open={open}
				onClose={handleClose}
				fullWidth
				maxWidth='sm'>
				<DialogTitle
					sx={{
						fontWeight: 'bold',
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
					}}>
					Price Tiers - {product?.name}
					<Typography>Base Price: {product.basePrice}</Typography>
					{!showForm && (
						<Button
							startIcon={<AddIcon />}
							variant='contained'
							size='small'
							onClick={() => setShowForm(true)}>
							Add Tier
						</Button>
					)}
				</DialogTitle>

				<DialogContent dividers>
					{/* --- Existing Tiers List --- */}
					<Stack spacing={2}>
						{product?.priceTiers?.length > 0 ?
							product.priceTiers.map((tier) => (
								<Box
									key={tier.id}
									sx={{
										p: 1.5,
										border: '1px solid',
										borderColor: 'divider',
										borderRadius: 1,
										display: 'flex',
										justifyContent: 'space-between',
										alignItems: 'center',
									}}>
									<Stack
										direction='row'
										spacing={2}>
										<Chip
											label={tier.name}
											color='secondary'
											size='small'
											variant='outlined'
										/>
										<Typography variant='body2'>
											Min Qty: <b>{tier.minQty}</b>
										</Typography>
										<Typography
											variant='body2'
											color='primary'>
											Price: <b>৳{tier.price}</b>
										</Typography>
									</Stack>
									<IconButton
										size='small'
										color='error'
										onClick={() => handleDeletePriceTier(tier.id)}>
										<DeleteIcon fontSize='small' />
									</IconButton>
								</Box>
							))
						:	!showForm && (
								<Typography
									variant='body2'
									color='text.secondary'
									sx={{ textAlign: 'center' }}>
									No price tiers found.
								</Typography>
							)
						}

						{/* --- Add New Tier Form --- */}
						{showForm && (
							<Box
								sx={{ p: 2, bgcolor: 'action.hover', borderRadius: 2, mt: 2 }}>
								<Typography
									variant='subtitle2'
									gutterBottom
									fontWeight='bold'>
									Create New Tier
								</Typography>
								<Stack spacing={2}>
									<Stack
										direction='row'
										spacing={2}>
										<TextField
											select
											fullWidth
											size='small'
											label='Tier Name'
											value={formData.name}
											onChange={(e) =>
												setFormData({ ...formData, name: e.target.value })
											}>
											{TIER_NAMES.map((name) => (
												<MenuItem
													key={name}
													value={name}>
													{name}
												</MenuItem>
											))}
										</TextField>
										<TextField
											fullWidth
											size='small'
											type='number'
											label='Min Quantity'
											value={formData.minQty}
											onChange={(e) =>
												setFormData({ ...formData, minQty: e.target.value })
											}
										/>
									</Stack>
									<TextField
										fullWidth
										size='small'
										type='number'
										label='Price'
										value={formData.price}
										onChange={(e) =>
											setFormData({ ...formData, price: e.target.value })
										}
									/>
									<Stack
										direction='row'
										spacing={1}
										sx={{ justifyContent: 'end' }}>
										<Button
											size='small'
											onClick={() => setShowForm(false)}>
											Cancel
										</Button>
										<Button
											size='small'
											variant='contained'
											onClick={handleAddTier}>
											Save Tier
										</Button>
									</Stack>
								</Stack>
							</Box>
						)}
					</Stack>
				</DialogContent>

				<DialogActions>
					<Button
						onClick={handleClose}
						color='inherit'>
						Close
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
}
