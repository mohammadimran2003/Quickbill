import { useFormContext, Controller } from 'react-hook-form';
import { Grid, FormControlLabel, Switch, Box, Typography } from '@mui/material';
import FormSection from './FormSection';

const StatusSection = () => {
	const { control } = useFormContext();

	return (
		<FormSection title='Status'>
			<Grid size={12}>
				<FormControlLabel
					control={
						<Controller
							name='isActive'
							control={control}
							render={({ field }) => (
								<Switch {...field} checked={field.value} color='primary' />
							)}
						/>
					}
					label={
						<Box>
							<Typography variant='body2' fontWeight={500}>
								Active Product
							</Typography>
							<Typography variant='caption' color='textSecondary'>
								Inactive products will not be visible in the store
							</Typography>
						</Box>
					}
					sx={{ ml: 1 }}
				/>
			</Grid>
		</FormSection>
	);
};

export default StatusSection;
