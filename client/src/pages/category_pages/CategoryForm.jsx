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
import { createCategorySchema } from '../../validations/categoryValidation';
import createCategory from '../../api/categories_api/createCategory';
import getCategoryById from '../../api/categories_api/getCategoryById';
import { toast } from 'sonner';
import updateCategory from '../../api/categories_api/updateCategory';

const defaultValues = {
	name: '',
	description: '',
	image: '',
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

function CategoryForm() {
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
		resolver: zodResolver(createCategorySchema),
		mode: 'onChange',
	});

	// Category by ID Query (Edit Mode)
	const { data: categoryData, isLoading: categoryLoading } = useQuery({
		queryKey: ['category', id],
		queryFn: () => getCategoryById(id),
		enabled: !!isEditMode,
	});

	// Create Mutation
	const createMutation = useMutation({
		mutationFn: createCategory,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['categories'] });
			navigate('/categories');
		},
	});

	// Update Mutation
	const updateMutation = useMutation({
		mutationFn: (data) => updateCategory(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['categories'] });
			navigate('/categories');
		},
	});

	useEffect(() => {
		if (categoryData?.data) {
			const category = categoryData.data;
			reset({
				name: category.name || '',
				description: category.description || '',
				image: category.image || '',
				isActive: category.isActive ?? true,
			});
		}
	}, [categoryData, reset]);

	const handleSave = async (formData) => {
		const action =
			isEditMode ?
				updateMutation.mutateAsync(formData)
			:	createMutation.mutateAsync(formData);

		await toast.promise(action, {
			loading: isEditMode ? 'Updating category...' : 'Creating category...',
			success:
				isEditMode ?
					'Category updated successfully'
				:	'Category created successfully',
			error: (err) => err?.response?.data?.message || 'Something went wrong',
		});
	};

	if (isEditMode && categoryLoading) {
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
				{isEditMode ? 'Edit Category' : 'Create Category'}
			</Typography>
			<Typography
				variant='body2'
				color='textSecondary'
				sx={{ mb: 3 }}>
				{isEditMode ?
					'Update category details and information'
				:	'Add a new category to your inventory'}
			</Typography>

			<Paper sx={{ p: 4, mt: 2 }}>
				<form
					onSubmit={handleSubmit(handleSave)}
					noValidate>
					{/* ========== CATEGORY INFORMATION SECTION ========== */}
					<FormSection title='Category Information'>
						<Grid size={12}>
							<TextField
								{...register('name')}
								label='Category Name'
								fullWidth
								variant='outlined'
								placeholder='Enter category name'
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
								placeholder='Enter category description'
								multiline
								rows={3}
								size='small'
							/>
						</Grid>

						<Grid size={12}>
							<TextField
								{...register('image')}
								label='Image URL'
								fullWidth
								variant='outlined'
								placeholder='Enter image URL (optional)'
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
							onClick={() => navigate('/categories')}
							disabled={isSubmitting}>
							Cancel
						</Button>
						<Button
							type='submit'
							variant='contained'
							color='primary'
							disabled={isSubmitting}>
							{isEditMode ? 'Update Category' : 'Create Category'}
						</Button>
					</Box>
				</form>
			</Paper>
		</Box>
	);
}

export default CategoryForm;
