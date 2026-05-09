import PageHeader from '../../components/shared/PageHeader';
import ProductTable from '../../components/products_comp/ProductTable';
import { Box } from '@mui/material';

function Products() {
	return (
		<Box sx={{ maxWidth: 1400, mx: 'auto', p: 3 }}>
			<PageHeader
				title='Products'
				btnText='Add Product'
				onBtnClick={() => console.log('Open Add Product Modal')}
			/>

			<ProductTable />
		</Box>
	);
}

export default Products;
