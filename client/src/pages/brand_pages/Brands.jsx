import BrandTable from '../../components/brands_comp/BrandTable';
import PageHeader from '../../components/shared/PageHeader';
import { Box } from '@mui/material';

function Brands() {
	return (
		<Box sx={{ maxWidth: 1400, mx: 'auto', p: 3 }}>
			<PageHeader
				title='Brands'
				btnText='Add Brand'
				onBtnClick={() => console.log('Open Add Brand Modal')}
			/>

			<BrandTable />
		</Box>
	);
}

export default Brands;
