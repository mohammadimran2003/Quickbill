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
import { createBrandSchema } from '../../validations/brandValidation';
import createBrand from '../../api/brands_api/createBrand';
import updateBrand from '../../api/brands_api/updateBrand';
import getBrandById from '../../api/brands_api/getBrandById';
import { toast } from 'sonner';

const defaultValues = {
	name: '',
	description: '',
	logo: '',
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

function BrandForm() {
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
		resolver: zodResolver(createBrandSchema),
		mode: 'onChange',
	});

	// Brand by ID Query (Edit Mode)
	const { data: brandData, isLoading: brandLoading } = useQuery({
		queryKey: ['brand', id],
		queryFn: () => getBrandById(id),
		enabled: !!isEditMode,
	});

	// Create Mutation
	const createMutation = useMutation({
		mutationFn: createBrand,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['brands'] });
			navigate('/brands');
		},
	});

	// Update Mutation
	const updateMutation = useMutation({
		mutationFn: (data) => updateBrand(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['brands'] });
			navigate('/brands');
		},
	});

	useEffect(() => {
		if (brandData?.data) {
			const brand = brandData.data;
			reset({
				name: brand.name || '',
				description: brand.description || '',
				logo: brand.logo || '',
				isActive: brand.isActive ?? true,
			});
		}
	}, [brandData, reset]);

	const handleSave = async (formData) => {
		const action =
			isEditMode ?
				updateMutation.mutateAsync(formData)
			:	createMutation.mutateAsync(formData);

		await toast.promise(action, {
			loading: isEditMode ? 'Updating brand...' : 'Creating brand...',
			success:
				isEditMode ?
					'Brand updated successfully'
				:	'Brand created successfully',
			error: (err) => err?.response?.data?.message || 'Something went wrong',
		});
	};

	if (isEditMode && brandLoading) {
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
				{isEditMode ? 'Edit Brand' : 'Create Brand'}
			</Typography>
			<Typography
				variant='body2'
				color='textSecondary'
				sx={{ mb: 3 }}>
				{isEditMode ?
					'Update brand details and information'
				:	'Add a new brand to your inventory'}
			</Typography>

			<Paper sx={{ p: 4, mt: 2 }}>
				<form
					onSubmit={handleSubmit(handleSave)}
					noValidate>
					{/* ========== BRAND INFORMATION SECTION ========== */}
					<FormSection title='Brand Information'>
						<Grid size={12}>
							<TextField
								{...register('name')}
								label='Brand Name'
								fullWidth
								variant='outlined'
								placeholder='Enter brand name'
								error={!!errors.name}
								helperText={errors.name?.message}
								size='small'
							/>
						</Grid>

						<Grid size={12}>
							<TextField
								{...register('description')}
								label='Description'
								fullWidth
								variant='outlined'
								placeholder='Enter brand description'
								multiline
								rows={3}
								size='small'
							/>
						</Grid>

						<Grid size={12}>
							<TextField
								{...register('logo')}
								label='Logo URL'
								fullWidth
								variant='outlined'
								placeholder='Enter logo URL (optional)'
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
							onClick={() => navigate('/brands')}
							disabled={isSubmitting}>
							Cancel
						</Button>
						<Button
							type='submit'
							variant='contained'
							color='primary'
							disabled={isSubmitting}>
							{isEditMode ? 'Update Brand' : 'Create Brand'}
						</Button>
					</Box>
				</form>
			</Paper>
		</Box>
	);
}

export default BrandForm;
