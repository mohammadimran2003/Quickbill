import { Box, Button, Typography } from '@mui/material';
import CustomerTable from '../components/customers_comp/CustomerTable';
import AddCircleIcon from '@mui/icons-material/AddCircle';
function Customers() {
	return (
		<Box sx={{ maxWidth: 1400, mx: 'auto' }}>
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'flex-start',
					flexWrap: 'wrap',
					gap: 2,
					mb: 4,
				}}>
				<Box
					sx={{
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
						width: '100%',
					}}>
					<Typography
						variant='h4'
						fontWeight={900}
						gutterBottom>
						Customer
					</Typography>
					<Button
						variant='contained'
						startIcon={<AddCircleIcon />}>
						Add
					</Button>
				</Box>
			</Box>
			<CustomerTable />
		</Box>
	);
}

export default Customers;
