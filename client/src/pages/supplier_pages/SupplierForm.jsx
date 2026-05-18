import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
	Box,
	Button,
	CircularProgress,
	FormControlLabel,
	Grid,
	Paper,
	TextField,
	Typography,
	Switch,
} from '@mui/material';
import { supplierSchema } from '../../validations/supplierValidations';
import createSupplier from '../../api/suppliers_api/createSupplier';
import getSupplierById from '../../api/suppliers_api/getSupplierById';
import updateSupplier from '../../api/suppliers_api/updateSupplier';
import { toast } from 'sonner';

const defaultValues = {
	name: '',
	phone: '',
	email: '',
	address: '',
	note: '',
	isActive: true,
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

function SupplierForm() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { id } = useParams();
	const isEditMode = Boolean(id);

	const {
		control,
		register,
		handleSubmit,
		reset,
		formState: { errors, isSubmitting },
	} = useForm({
		defaultValues,
		resolver: zodResolver(supplierSchema),
		mode: 'onChange',
	});

	// Supplier by ID Query (Edit Mode)
	const { data: supplierData, isLoading: supplierLoading } = useQuery({
		queryKey: ['supplier', id],
		queryFn: () => getSupplierById(id),
		enabled: !!isEditMode,
	});

	// Create Mutation
	const createMutation = useMutation({
		mutationFn: createSupplier,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['suppliers'] });
			navigate('/suppliers');
		},
	});

	// Update Mutation
	const updateMutation = useMutation({
		mutationFn: (data) => updateSupplier(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['suppliers'] });
			navigate('/suppliers');
		},
	});

	useEffect(() => {
		if (supplierData?.data) {
			const supplier = supplierData.data;
			reset({
				name: supplier.name || '',
				phone: supplier.phone || '',
				email: supplier.email || '',
				address: supplier.address || '',
				note: supplier.note || '',
				isActive: supplier.isActive ?? true,
			});
		}
	}, [supplierData, reset]);

	const handleSave = async (formData) => {
		const action =
			isEditMode ?
				updateMutation.mutateAsync(formData)
			:	createMutation.mutateAsync(formData);

		await toast.promise(action, {
			loading: isEditMode ? 'Updating supplier...' : 'Creating supplier...',
			success:
				isEditMode ?
					'Supplier updated successfully'
				:	'Supplier created successfully',
			error: (err) => err?.response?.data?.message || 'Something went wrong',
		});
	};

	if (isEditMode && supplierLoading) {
		return (
			<Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
				<CircularProgress />
			</Box>
		);
	}

	return (
		<Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
			<Typography
				variant='h4'
				fontWeight={700}
				gutterBottom
				sx={{ mb: 1 }}>
				{isEditMode ? 'Edit Supplier' : 'Create Supplier'}
			</Typography>
			<Typography
				variant='body2'
				color='textSecondary'
				sx={{ mb: 3 }}>
				{isEditMode ?
					'Update supplier details and information'
				:	'Add a new supplier to your list'}
			</Typography>

			<Paper sx={{ p: 4, mt: 2 }}>
				<form
					onSubmit={handleSubmit(handleSave)}
					noValidate>
					{/* ========== SUPPLIER INFORMATION SECTION ========== */}
					<FormSection title='Supplier Information'>
						<Grid size={{ xs: 12, sm: 6 }}>
							<TextField
								{...register('name')}
								label='Supplier Name'
								fullWidth
								variant='outlined'
								placeholder='Enter supplier name'
								error={!!errors.name}
								helperText={errors.name?.message}
								size='small'
							/>
						</Grid>

						<Grid size={{ xs: 12, sm: 6 }}>
							<TextField
								{...register('phone')}
								label='Phone Number'
								fullWidth
								variant='outlined'
								placeholder='Enter phone number'
								error={!!errors.phone}
								helperText={errors.phone?.message}
								size='small'
							/>
						</Grid>

						<Grid size={12}>
							<TextField
								{...register('email')}
								label='Email Address'
								fullWidth
								variant='outlined'
								placeholder='Enter email address (optional)'
								error={!!errors.email}
								helperText={errors.email?.message}
								size='small'
							/>
						</Grid>

						<Grid size={12}>
							<TextField
								{...register('address')}
								label='Address'
								fullWidth
								variant='outlined'
								placeholder='Enter address'
								multiline
								rows={2}
								size='small'
							/>
						</Grid>

						<Grid size={12}>
							<TextField
								{...register('note')}
								label='Note'
								fullWidth
								variant='outlined'
								placeholder='Enter any additional note'
								multiline
								rows={3}
								size='small'
							/>
						</Grid>

						<Grid size={12}>
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
								label='Active'
							/>
						</Grid>
					</FormSection>

					{/* ========== FORM ACTIONS ========== */}
					<Box
						sx={{
							display: 'flex',
							justifyContent: 'flex-end',
							gap: 2,
							mt: 4,
						}}>
						<Button
							variant='outlined'
							color='inherit'
							onClick={() => navigate('/suppliers')}
							disabled={isSubmitting}>
							Cancel
						</Button>
						<Button
							type='submit'
							variant='contained'
							color='primary'
							disabled={isSubmitting}>
							{isEditMode ? 'Update Supplier' : 'Create Supplier'}
						</Button>
					</Box>
				</form>
			</Paper>
		</Box>
	);
}

export default SupplierForm;
