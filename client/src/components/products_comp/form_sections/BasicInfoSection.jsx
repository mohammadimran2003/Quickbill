import { useFormContext } from 'react-hook-form';
import { Grid, TextField } from '@mui/material';
import FormSection from './FormSection';

const BasicInfoSection = () => {
	const {
		register,
		formState: { errors },
	} = useFormContext();

	return (
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
	);
};

export default BasicInfoSection;
