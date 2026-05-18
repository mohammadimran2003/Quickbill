import { useFormContext } from 'react-hook-form';
import { Grid, Typography, Stack, Divider, TextField } from '@mui/material';
import FormSection from './FormSection';

const PurchaseSummarySection = () => {
	const {
		register,
		watch,
		formState: { errors },
	} = useFormContext();

	const total = watch('total') || 0;
	const dueAmount = watch('dueAmount') || 0;

	return (
		<FormSection title='Summary & Payment'>
			<Grid size={6}></Grid>
			<Grid size={6}>
				<Stack
					spacing={2}
					sx={{ bgcolor: 'action.hover', p: 2, borderRadius: 1 }}>
					<Stack direction='row' justifyContent='space-between'>
						<Typography fontWeight={500}>Subtotal:</Typography>
						<Typography>{total.toFixed(2)}</Typography>
					</Stack>
					<Stack direction='row' justifyContent='space-between'>
						<Typography fontWeight={500}>Total:</Typography>
						<Typography>{total.toFixed(2)}</Typography>
					</Stack>
					<Divider />
					<Stack
						direction='row'
						justifyContent='space-between'
						alignItems='center'>
						<Typography fontWeight={500}>Paid Amount:</Typography>
						<TextField
							{...register('paidAmount', { valueAsNumber: true })}
							type='number'
							size='small'
							error={!!errors.paidAmount}
							helperText={errors.paidAmount?.message}
							sx={{ width: 150 }}
							inputProps={{ min: 0, step: '0.01' }}
						/>
					</Stack>
					<Stack direction='row' justifyContent='space-between'>
						<Typography
							fontWeight={600}
							color={dueAmount > 0 ? 'error.main' : 'success.main'}>
							Due Amount:
						</Typography>
						<Typography
							fontWeight={600}
							color={dueAmount > 0 ? 'error.main' : 'success.main'}>
							{dueAmount.toFixed(2)}
						</Typography>
					</Stack>
				</Stack>
			</Grid>
		</FormSection>
	);
};

export default PurchaseSummarySection;
