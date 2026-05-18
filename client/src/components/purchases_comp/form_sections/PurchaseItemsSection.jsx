import { useState } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import {
	Grid,
	TextField,
	Typography,
	Autocomplete,
	IconButton,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import FormSection from './FormSection';

const PurchaseItemsSection = ({ productsData }) => {
	const [productSearch, setProductSearch] = useState(null);

	const {
		control,
		watch,
		formState: { errors },
	} = useFormContext();

	const { fields, append, remove, update } = useFieldArray({
		control,
		name: 'items',
	});

	const items = watch('items');

	const handleAddProduct = (event, product) => {
		if (product) {
			const existingItemIndex = items.findIndex(
				(item) => item.productId === product.id,
			);

			if (existingItemIndex >= 0) {
				const currentItem = items[existingItemIndex];
				const newQuantity = currentItem.quantity + 1;

				update(existingItemIndex, {
					...currentItem,
					quantity: newQuantity,
					total: newQuantity * currentItem.unitCost,
				});
			} else {
				append({
					productId: product.id,
					productName: product.name,
					quantity: 1,
					unitCost: product.costPrice || 0,
					total: product.costPrice || 0,
				});
			}
			setProductSearch(null); // Reset selection
		}
	};

	const handleQuantityChange = (index, newQuantity) => {
		const parsedQuantity = parseInt(newQuantity, 10);
		if (!isNaN(parsedQuantity) && parsedQuantity >= 1) {
			const currentItem = items[index];
			update(index, {
				...currentItem,
				quantity: parsedQuantity,
				total: parsedQuantity * currentItem.unitCost,
			});
		}
	};

	const handleUnitCostChange = (index, newCost) => {
		const parsedCost = parseFloat(newCost);
		if (!isNaN(parsedCost) && parsedCost >= 0) {
			const currentItem = items[index];
			update(index, {
				...currentItem,
				unitCost: parsedCost,
				total: currentItem.quantity * parsedCost,
			});
		}
	};

	return (
		<FormSection title='Purchase Items'>
			<Grid size={12}>
				<Autocomplete
					options={productsData?.data || []}
					getOptionLabel={(option) =>
						`${option.name} (${option.sku || option.barcode || 'No SKU'})`
					}
					value={productSearch}
					onChange={handleAddProduct}
					renderInput={(params) => (
						<TextField
							{...params}
							label='Search and Add Product'
							variant='outlined'
							size='small'
						/>
					)}
				/>
			</Grid>

			<Grid size={12}>
				<TableContainer
					component={Paper}
					variant='outlined'
					sx={{ mt: 2 }}>
					<Table size='small'>
						<TableHead sx={{ bgcolor: 'action.hover' }}>
							<TableRow>
								<TableCell>Product Name</TableCell>
								<TableCell width='15%'>Quantity</TableCell>
								<TableCell width='20%'>Unit Cost</TableCell>
								<TableCell width='20%'>Total</TableCell>
								<TableCell align='center' width='10%'>
									Action
								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{fields.map((field, index) => (
								<TableRow key={field.id}>
									<TableCell>{items[index]?.productName}</TableCell>
									<TableCell>
										<TextField
											type='number'
											size='small'
											value={items[index]?.quantity || ''}
											onChange={(e) =>
												handleQuantityChange(index, e.target.value)
											}
											inputProps={{ min: 1 }}
										/>
									</TableCell>
									<TableCell>
										<TextField
											type='number'
											size='small'
											value={items[index]?.unitCost || ''}
											onChange={(e) =>
												handleUnitCostChange(index, e.target.value)
											}
											inputProps={{ min: 0, step: '0.01' }}
										/>
									</TableCell>
									<TableCell>{items[index]?.total?.toFixed(2)}</TableCell>
									<TableCell align='center'>
										<IconButton
											color='error'
											size='small'
											onClick={() => remove(index)}>
											<DeleteIcon fontSize='small' />
										</IconButton>
									</TableCell>
								</TableRow>
							))}
							{fields.length === 0 && (
								<TableRow>
									<TableCell
										colSpan={5}
										align='center'
										sx={{ py: 3, color: 'text.secondary' }}>
										No items added yet. Please search and select a product above.
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</TableContainer>
				{errors.items && (
					<Typography
						color='error'
						variant='caption'
						sx={{ mt: 1, display: 'block' }}>
						{errors.items.message}
					</Typography>
				)}
			</Grid>
		</FormSection>
	);
};

export default PurchaseItemsSection;
