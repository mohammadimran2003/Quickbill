import DashboardIcon from '@mui/icons-material/Dashboard';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import CategoryIcon from '@mui/icons-material/Category';
import BrandingWatermarkIcon from '@mui/icons-material/BrandingWatermark';
import PeopleIcon from '@mui/icons-material/People';
import BarChartIcon from '@mui/icons-material/BarChart';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import StoreIcon from '@mui/icons-material/Store';

const menuSections = [
	{
		section: 'Overview',
		items: [
			{
				label: 'Dashboard',
				path: '/dashboard',
				icon: <DashboardIcon />,
			},
		],
	},
	{
		section: 'Sales',
		items: [
			{
				label: 'New Sale',
				path: '/pos',
				icon: <PointOfSaleIcon />,
			},
			{
				label: 'Orders',
				path: '/orders',
				icon: <ReceiptLongIcon />,
			},
		],
	},
	{
		section: 'Inventory',
		items: [
			{
				id: 'products',
				label: 'Products',
				path: '/products',
				icon: <Inventory2Icon />,
				subitems: [
					{ label: 'All Products', path: '/products/all-products' },
					{ label: 'Add Product', path: '/products/add-products' },
				],
			},
			{
				id: 'categories',
				label: 'Categories',
				path: '/categories',
				icon: <CategoryIcon />,
				subitems: [
					{ label: 'All Categories', path: '/categories/all-categories' },
					{ label: 'Add Category', path: '/categories/add-category' },
				],
			},
			{
				id: 'brands',
				label: 'Brands',
				path: '/brands',
				icon: <BrandingWatermarkIcon />,
				subitems: [
					{ label: 'All Brands', path: '/brands/all-brands' },
					{ label: 'Add Brand', path: '/brands/add-brand' },
				],
			},
		],
	},
	{
		section: 'People',
		items: [
			{
				id: 'customers',
				label: 'Customers',
				path: '/customers',
				icon: <PeopleIcon />,
			},
		],
	},
	{
		section: 'Reports',
		items: [
			{
				label: 'Sales Report',
				path: '/reports/sales',
				icon: <BarChartIcon />,
			},
			{
				label: 'Profit Report',
				path: '/reports/profit',
				icon: <TrendingUpIcon />,
			},
			{
				label: 'Stock Report',
				path: '/reports/stock',
				icon: <WarehouseIcon />,
			},
		],
	},
	{
		section: 'Settings',
		items: [
			{
				label: 'Users',
				path: '/settings/users',
				icon: <PeopleAltIcon />,
			},
			{
				label: 'Store Info',
				path: '/settings/store',
				icon: <StoreIcon />,
			},
		],
	},
];

export default menuSections;
