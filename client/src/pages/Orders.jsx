import PageHeader from '../components/shared/PageHeader';
import OrderTable from '../components/orders_comp/OrderTable';
import { Box } from '@mui/material';

function Orders() {
	return (
		<Box sx={{ maxWidth: 1400, mx: 'auto', p: 3 }}>
			<PageHeader title='Orders' />

			<OrderTable />
		</Box>
	);
}

export default Orders;
