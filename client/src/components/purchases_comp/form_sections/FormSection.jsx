import { Box, Typography, Grid } from '@mui/material';

const FormSection = ({ title, children }) => (
	<Box sx={{ mb: 4 }}>
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
		<Grid container spacing={2}>
			{children}
		</Grid>
	</Box>
);

export default FormSection;
