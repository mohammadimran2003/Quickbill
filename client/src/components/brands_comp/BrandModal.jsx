import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
	Button,
	FormControlLabel,
	Switch,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { createBrandSchema } from '../../validations/brandValidation';

const BrandModal = ({ open, onClose, onSave, initialData = null }) => {
	const isEditMode = !!initialData;

	const {
		control,
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm({
		defaultValues: {
			name: '',
			description: '',
			logo: '',
			isActive: true,
		},
		resolver: zodResolver(createBrandSchema),
		mode: 'onChange',
	});

	useEffect(() => {
		if (open) {
			if (initialData) {
				reset({
					name: initialData.name || '',
					description: initialData.description || '',
					logo: initialData.logo || '',
					isActive:
						initialData.isActive !== undefined ? initialData.isActive : true,
				});
			} else {
				reset({
					name: '',
					description: '',
					logo: '',
					isActive: true,
				});
			}
		}
	}, [initialData, open, reset]);

	const handleSave = (data) => {
		onSave(data);
		reset();
	};

	const handleClose = () => {
		reset();
		onClose();
	};

	return (
		<Dialog
			open={open}
			onClose={handleClose}
			maxWidth='sm'
			fullWidth
			slotProps={{
				paper: {
					sx: {
						borderRadius: 2,
					},
				},
			}}>
			<DialogTitle
				sx={{
					fontWeight: 700,
					fontSize: '1.5rem',
					px: 3,
					py: 2,
				}}>
				{isEditMode ? 'Edit Brand' : 'Add New Brand'}
			</DialogTitle>

			<DialogContent
				sx={{
					px: 3,
					py: 4,
					display: 'flex',
					flexDirection: 'column',
					gap: 2.5,
				}}
				component='form'>
				{/* Name Field */}
				<TextField
					{...register('name')}
					label='Brand Name'
					fullWidth
					variant='outlined'
					placeholder='Enter brand name'
					error={!!errors.name}
					helperText={errors.name?.message}
					size='small'
					sx={{ mt: 1 }}
				/>

				{/* Description Field */}
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

				{/* Logo URL Field */}
				<TextField
					{...register('logo')}
					label='Logo URL'
					fullWidth
					variant='outlined'
					placeholder='Enter logo URL (optional)'
					size='small'
				/>

				{/* Active Status */}
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
			</DialogContent>

			<DialogActions
				sx={{
					gap: 1,
					p: 2,
				}}>
				<Button
					onClick={handleClose}
					variant='outlined'
					color='inherit'>
					Cancel
				</Button>
				<Button
					onClick={handleSubmit(handleSave)}
					variant='contained'
					color='primary'>
					{isEditMode ? 'Update' : 'Add'}
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default BrandModal;
