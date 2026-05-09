import PageHeader from '../../components/shared/PageHeader';
import CategoryTable from '../../components/categories_comp/CategoryTable';
import { Box } from '@mui/material';

function Categories() {
	return (
		<Box sx={{ maxWidth: 1400, mx: 'auto', p: 3 }}>
			<PageHeader
				title='Categories'
				btnText='Add Category'
				onBtnClick={() => console.log('Open Add Category Modal')}
			/>

			<CategoryTable />
		</Box>
	);
}

export default Categories;
