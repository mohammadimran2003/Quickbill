import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
	Box,
	Button,
	CircularProgress,
	Divider,
	FormControl,
	FormControlLabel,
	FormHelperText,
	Grid,
	MenuItem,
	Paper,
	Select,
	TextField,
	Typography,
	Switch,
	InputLabel,
	Autocomplete,
	Chip,
} from '@mui/material';
import productsSchema from '../../validations/productValidations';
import getCategories from '../../api/categories_api/getCategories';
import getBrands from '../../api/brands_api/getBrands';
import createProduct from '../../api/products_api/createProduct';
import updateProduct from '../../api/products_api/updateProduct';
import getProductById from '../../api/products_api/getProductById';
import { toast } from 'sonner';

const defaultValues = {
	name: '',
	description: '',
	images: [],
	barcode: '',
	sku: '',
	productType: 'SIMPLE',
	categoryId: '',
	brandId: '',
	costPrice: 0,
	basePrice: 0,
	discountType: undefined,
	discountValue: undefined,
	stock: 0,
	lowStockAlert: 5,
	unit: 'PCS',
	taxRate: 0,
	isActive: true,
	tags: [],
};

// Reusable Form Section Component
const FormSection = ({ title, children }) => (
	<Box sx={{ mb: 3 }}>
		<Typography
			variant='h6'
			sx={{
				fontWeight: 600,
				fontSize: '1rem',
				mb: 2,
				color: 'text.primary',
				textTransform: 'uppercase',
				letterSpacing: 0.5,
			}}>
			{title}
		</Typography>
		<Grid
			container
			spacing={2}>
			{children}
		</Grid>
	</Box>
);

function ProductForm() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { id } = useParams();
	const isEditMode = Boolean(id);

	const {
		control,
		register,
		handleSubmit,
		reset,
		watch,
		formState: { errors, isSubmitting },
	} = useForm({
		defaultValues,
		resolver: zodResolver(productsSchema),
		mode: 'onChange',
	});

	const discountType = watch('discountType');
	const isDiscountValueDisabled = !discountType || discountType === 'NONE';

	// 1. Categories Query
	const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
		queryKey: ['categories'],
		queryFn: () => getCategories({}),
		staleTime: 1000 * 60,
	});

	// 2. Brands Query
	const { data: brandsData, isLoading: brandsLoading } = useQuery({
		queryKey: ['brands'],
		queryFn: () => getBrands({}),
		staleTime: 1000 * 60,
	});

	// 3. Product by ID Query (Edit Mode)
	const { data: productData, isLoading: productLoading } = useQuery({
		queryKey: ['product', id],
		queryFn: () => getProductById(id),
		enabled: !!isEditMode, // !! diye boolean nishchit kora bhalo
	});

	// 4. Create Mutation
	const createMutation = useMutation({
		mutationFn: createProduct,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['products'] });
			navigate('/products');
		},
	});

	// 5. Update Mutation
	const updateMutation = useMutation({
		mutationFn: (data) => updateProduct(id, data), // mutationFn ekti object-e thakbe
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['products'] });
			navigate('/products');
		},
	});

	useEffect(() => {
		if (productData?.data) {
			const product = productData.data;
			reset({
				name: product.name || '',
				description: product.description || '',
				images: product.images || [],
				barcode: product.barcode || '',
				sku: product.sku || '',
				productType: product.productType || 'SIMPLE',
				categoryId: product.categoryId || '',
				brandId: product.brandId || '',
				costPrice: product.costPrice ?? 0,
				basePrice: product.basePrice ?? 0,
				discountType: product.discountType ?? undefined,
				discountValue: product.discountValue ?? undefined,
				stock: product.stock ?? 0,
				lowStockAlert: product.lowStockAlert ?? 5,
				unit: product.unit || 'PCS',
				taxRate: product.taxRate ?? 0,
				isActive: product.isActive ?? true,
				tags: product.tags || [],
			});
		}
	}, [productData, reset]);

	const handleSave = async (formData) => {
		const payload = {
			...formData,
			images: formData.images || [],
			tags: formData.tags || [],
		};

		console.log(payload, 'payload of formData');

		const action =
			isEditMode ?
				updateMutation.mutateAsync({ id, data: payload })
			:	createMutation.mutateAsync(payload);

		await toast.promise(action, {
			loading: isEditMode ? 'Updating product...' : 'Creating product...',
			success:
				isEditMode ?
					'Product updated successfully'
				:	'Product created successfully',
			error: (err) => err?.response?.data?.message || 'Something went wrong',
		});
	};

	if (isEditMode && productLoading) {
		return (
			<Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
				<CircularProgress />
			</Box>
		);
	}

	return (
		<Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
			<Typography
				variant='h4'
				fontWeight={700}
				gutterBottom
				sx={{ mb: 1 }}>
				{isEditMode ? 'Edit Product' : 'Create Product'}
			</Typography>
			<Typography
				variant='body2'
				color='textSecondary'
				sx={{ mb: 3 }}>
				{isEditMode ?
					'Update product details and pricing information'
				:	'Add a new product to your inventory'}
			</Typography>

			<Paper sx={{ p: 4, mt: 2 }}>
				<form
					onSubmit={handleSubmit(handleSave)}
					noValidate>
					{/* ========== BASIC INFORMATION SECTION ========== */}
					<FormSection title='Basic Information'>
						<Grid size={6}>
							<TextField
								{...register('name')}
								label='Product Name'
								fullWidth
								variant='outlined'
								error={!!errors.name}
								helperText={errors.name?.message}
								size='small'
								placeholder='Enter product name'
							/>
						</Grid>

						<Grid size={3}>
							<TextField
								{...register('barcode')}
								label='Barcode'
								fullWidth
								variant='outlined'
								error={!!errors.barcode}
								helperText={errors.barcode?.message}
								size='small'
								placeholder='e.g., 1234567890'
							/>
						</Grid>

						<Grid size={3}>
							<TextField
								{...register('sku')}
								label='SKU'
								fullWidth
								variant='outlined'
								error={!!errors.sku}
								helperText={errors.sku?.message}
								size='small'
								placeholder='e.g., SKU-001'
							/>
						</Grid>

						<Grid size={12}>
							<TextField
								{...register('description')}
								label='Description'
								fullWidth
								variant='outlined'
								multiline
								rows={4}
								size='small'
								placeholder='Enter detailed product description'
							/>
						</Grid>
					</FormSection>

					<Divider sx={{ my: 1 }} />

					{/* ========== CATEGORY & TYPE SECTION ========== */}
					<FormSection title='Category & Type'>
						<Grid size={4}>
							<Controller
								name='categoryId'
								control={control}
								render={({ field }) => (
									<FormControl
										fullWidth
										size='small'
										error={!!errors.categoryId}>
										<InputLabel>Category</InputLabel>
										<Select
											{...field}
											label='Category'>
											<MenuItem value=''>Select category</MenuItem>
											{categoriesData?.data?.map((category) => (
												<MenuItem
													key={category.id}
													value={category.id}>
													{category.name}
												</MenuItem>
											))}
										</Select>
										<FormHelperText>
											{errors.categoryId?.message}
										</FormHelperText>
									</FormControl>
								)}
							/>
						</Grid>

						<Grid size={4}>
							<Controller
								name='brandId'
								control={control}
								defaultValue=''
								render={({ field, fieldState: { error } }) => (
									<FormControl
										fullWidth
										size='small'
										variant='outlined'
										error={!!error}>
										<InputLabel id='brand-select-label'>Brand</InputLabel>
										<Select
											{...field}
											labelId='brand-select-label'
											id='brand-select'
											label='Brand'
											value={field.value ?? ''}>
											<MenuItem value=''>Select brand</MenuItem>
											{brandsData?.data?.map((brand) => (
												<MenuItem
													key={brand.id}
													value={brand.id}>
													{brand.name}
												</MenuItem>
											))}
										</Select>
										{error && <FormHelperText>{error.message}</FormHelperText>}
									</FormControl>
								)}
							/>
						</Grid>

						<Grid size={4}>
							<Controller
								name='productType'
								control={control}
								render={({ field }) => (
									<TextField
										select
										label='Product Type'
										fullWidth
										variant='outlined'
										size='small'
										{...field}
										value={field.value ?? 'SIMPLE'}>
										<MenuItem value='SIMPLE'>Simple</MenuItem>
										<MenuItem value='VARIANT'>Variant</MenuItem>
										<MenuItem value='COMPOSITE'>Composite</MenuItem>
									</TextField>
								)}
							/>
						</Grid>
					</FormSection>

					<Divider sx={{ my: 1 }} />

					{/* ========== PRICING SECTION ========== */}
					<FormSection title='Pricing & Discount'>
						<Grid size={3}>
							<TextField
								{...register('costPrice', { valueAsNumber: true })}
								label='Cost Price'
								type='number'
								fullWidth
								onFocus={(event) => {
									if (event.target.value === '0') {
										event.target.select();
									}
								}}
								variant='outlined'
								error={!!errors.costPrice}
								helperText={errors.costPrice?.message}
								size='small'
								placeholder='0.00'
							/>
						</Grid>

						<Grid size={3}>
							<TextField
								{...register('basePrice', { valueAsNumber: true })}
								label='Base Price'
								type='number'
								fullWidth
								onFocus={(event) => {
									if (event.target.value === '0') {
										event.target.select();
									}
								}}
								variant='outlined'
								error={!!errors.basePrice}
								helperText={errors.basePrice?.message}
								size='small'
								placeholder='0.00'
							/>
						</Grid>

						<Grid size={3}>
							<TextField
								{...register('taxRate', { valueAsNumber: true })}
								label='Tax Rate (%)'
								type='number'
								fullWidth
								onFocus={(event) => {
									if (event.target.value === '0') {
										event.target.select();
									}
								}}
								variant='outlined'
								error={!!errors.taxRate}
								helperText={errors.taxRate?.message}
								size='small'
								placeholder='0.00'
							/>
						</Grid>

						<Grid size={3}>
							<Controller
								name='unit'
								control={control}
								render={({ field }) => (
									<TextField
										select
										label='Unit'
										fullWidth
										variant='outlined'
										size='small'
										{...field}>
										<MenuItem value='PCS'>PCS</MenuItem>
										<MenuItem value='KG'>KG</MenuItem>
										<MenuItem value='GRAM'>GRAM</MenuItem>
										<MenuItem value='LITRE'>LITRE</MenuItem>
										<MenuItem value='DOZEN'>DOZEN</MenuItem>
										<MenuItem value='METER'>METER</MenuItem>
										<MenuItem value='BOX'>BOX</MenuItem>
									</TextField>
								)}
							/>
						</Grid>

						<Grid size={4}>
							<Controller
								name='discountType'
								control={control}
								render={({ field }) => (
									<TextField
										select
										label='Discount Type'
										fullWidth
										variant='outlined'
										size='small'
										{...field}
										value={field.value ?? ''}
										onChange={(event) =>
											field.onChange(event.target.value || undefined)
										}>
										<MenuItem value='NONE'>No Discount</MenuItem>
										<MenuItem value='FLAT'>Flat Amount</MenuItem>
										<MenuItem value='PERCENTAGE'>Percentage</MenuItem>
									</TextField>
								)}
							/>
						</Grid>

						<Grid size={8}>
							<TextField
								{...register('discountValue', { valueAsNumber: true })}
								label='Discount Value'
								type='number'
								disabled={isDiscountValueDisabled}
								fullWidth
								defaultValue={0}
								variant='outlined'
								error={!!errors.discountValue}
								helperText={errors.discountValue?.message}
								size='small'
								placeholder='0.00'
							/>
						</Grid>
					</FormSection>

					<Divider sx={{ my: 1 }} />

					{/* ========== INVENTORY SECTION ========== */}
					<FormSection title='Inventory Management'>
						<Grid size={4}>
							<TextField
								{...register('stock', { valueAsNumber: true })}
								label='Current Stock'
								type='number'
								onFocus={(event) => {
									if (event.target.value === '0') {
										event.target.select();
									}
								}}
								fullWidth
								variant='outlined'
								error={!!errors.stock}
								helperText={errors.stock?.message}
								size='small'
								placeholder='0'
							/>
						</Grid>

						<Grid size={8}>
							<TextField
								{...register('lowStockAlert', { valueAsNumber: true })}
								label='Low Stock Alert Threshold'
								type='number'
								fullWidth
								onFocus={(event) => {
									if (event.target.value === '0') {
										event.target.select();
									}
								}}
								variant='outlined'
								error={!!errors.lowStockAlert}
								helperText={
									errors.lowStockAlert?.message ||
									'Alert will trigger when stock falls below this value'
								}
								size='small'
								placeholder='5'
							/>
						</Grid>
					</FormSection>

					<Divider sx={{ my: 1 }} />

					<FormSection title='Media & Metadata'>
						<Grid size={6}>
							<Controller
								name='images'
								control={control}
								render={({ field }) => (
									<TextField
										label='Product Images'
										fullWidth
										variant='outlined'
										multiline
										rows={3}
										value={field.value?.join('\n') ?? ''}
										onChange={(event) =>
											field.onChange(
												event.target.value
													.split('\n')
													.map((url) => url.trim())
													.filter(Boolean),
											)
										}
										placeholder='https://example.com/image1.jpg&#10;https://example.com/image2.jpg'
										size='small'
										helperText='Enter one image URL per line'
									/>
								)}
							/>
						</Grid>

						<Grid size={6}>
							<Controller
								name='tags'
								control={control}
								render={({ field: { onChange, value } }) => (
									<Autocomplete
										multiple
										freeSolo
										disablePortal
										sx={{ width: '100%' }}
										options={[]}
										value={value || []}
										onChange={(event, newValue) => onChange(newValue)}
										rendertags={(tagValue, getTagProps) =>
											tagValue.map((option, index) => {
												const { key, ...tagProps } = getTagProps({ index });
												return (
													<Chip
														key={key}
														variant='outlined'
														label={option}
														size='small'
														{...tagProps}
													/>
												);
											})
										}
										renderInput={(params) => (
											<TextField
												{...params}
												label='Tags'
												size='small'
												placeholder='Type and press Enter'
											/>
										)}
									/>
								)}
							/>
						</Grid>
					</FormSection>

					<Divider sx={{ my: 1 }} />

					{/* ========== STATUS SECTION ========== */}
					<FormSection title='Status'>
						<Grid xs={12}>
							<FormControlLabel
								control={
									<Controller
										name='isActive'
										control={control}
										render={({ field }) => (
											<Switch
												{...field}
												checked={field.value}
												color='primary'
											/>
										)}
									/>
								}
								label={
									<Box>
										<Typography
											variant='body2'
											fontWeight={500}>
											Active Product
										</Typography>
										<Typography
											variant='caption'
											color='textSecondary'>
											Inactive products will not be visible in the store
										</Typography>
									</Box>
								}
								sx={{ ml: 1 }}
							/>
						</Grid>
					</FormSection>

					{/* ========== ACTION BUTTONS ========== */}
					<Box
						sx={{
							display: 'flex',
							justifyContent: 'flex-end',
							gap: 2,
							mt: 4,
							pt: 2,
							borderTop: '1px solid #e0e0e0',
						}}>
						<Button
							variant='outlined'
							onClick={() => navigate('/products')}>
							Cancel
						</Button>
						<Button
							type='submit'
							variant='contained'
							color='primary'
							disabled={isSubmitting || categoriesLoading || brandsLoading}>
							{isEditMode ? 'Update Product' : 'Create Product'}
						</Button>
					</Box>
				</form>
			</Paper>
		</Box>
	);
}

export default ProductForm;
