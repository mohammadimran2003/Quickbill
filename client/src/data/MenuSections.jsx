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
import LocalShippingIcon from '@mui/icons-material/LocalShipping';

const menuSections = [
	{
		id: 1,
		section: 'Overview',
		items: [
			{
				id: 'overview_items-1',
				label: 'Dashboard',
				path: '/dashboard',
				icon: <DashboardIcon />,
			},
		],
	},
	{
		id: 2,
		section: 'Sales',
		items: [
			{
				id: 'sales_items-1',
				label: 'POS',
				path: '/pos',
				icon: <PointOfSaleIcon />,
			},
			{
				id: 'sales_items-2',
				label: 'Orders',
				path: '/orders',
				icon: <ReceiptLongIcon />,
			},
		],
	},
	{
		id: 3,
		section: 'Inventory',
		items: [
			{
				id: 'products',
				label: 'Products',
				icon: <Inventory2Icon />,
				subitems: [
					{ id: 'products_id-1', label: 'List products', path: '/products' },
					{
						id: 'products_id-2',
						label: 'Create product',
						path: '/products/create-products',
					},
				],
			},
			{
				id: 'categories',
				label: 'Categories',
				icon: <CategoryIcon />,
				subitems: [
					{
						id: 'categories_id-1',
						label: 'List categories',
						path: '/categories',
					},
					{
						id: 'categories_id-2',
						label: 'Create category',
						path: '/categories/create-category',
					},
				],
			},
			{
				id: 'suppliers',
				label: 'Suppliers',
				icon: <LocalShippingIcon />,
				subitems: [
					{
						id: 'suppliers_id-1',
						label: 'List suppliers',
						path: '/suppliers',
					},
					{
						id: 'suppliers_id-2',
						label: 'Create supplier',
						path: '/suppliers/create-supplier',
					},
				],
			},
			{
				id: 'purchases',
				label: 'Purchases',
				icon: <Inventory2Icon />,
				subitems: [
					{
						id: 'purchases_id-1',
						label: 'List purchases',
						path: '/purchases',
					},
					{
						id: 'purchases_id-2',
						label: 'Create purchase',
						path: '/purchases/create-purchase',
					},
				],
			},
			{
				id: 'brands',
				label: 'Brands',
				icon: <BrandingWatermarkIcon />,
				subitems: [
					{ id: 'brands_id-1', label: 'List brands', path: '/brands' },
					{
						id: 'brands_id-2',
						label: 'Create brand',
						path: '/brands/create-brand',
					},
				],
			},
		],
	},
	{
		id: 4,
		section: 'People',
		items: [
			{
				id: 'customers',
				label: 'Customers',
				icon: <PeopleIcon />,
				subitems: [
					{
						id: 'customers_id-1',
						label: 'List customers',
						path: '/customers',
					},
					{
						id: 'customers_id-2',
						label: 'Create customer',
						path: '/customers/create-customer',
					},
				],
			},
		],
	},
	{
		id: 5,
		section: 'Reports',
		items: [
			{
				id: 'reports_id-1',
				label: 'Sales Report',
				path: '/reports/sales',
				icon: <BarChartIcon />,
			},
			{
				id: 'reports_id-2',
				label: 'Profit Report',
				path: '/reports/profit',
				icon: <TrendingUpIcon />,
			},
			{
				id: 'reports_id-3',
				label: 'Stock Report',
				path: '/reports/stock',
				icon: <WarehouseIcon />,
			},
		],
	},
	{
		id: 6,
		section: 'Settings',
		items: [
			{
				id: 'settings_id-1',
				label: 'Users',
				path: '/settings/users',
				icon: <PeopleAltIcon />,
			},
			{
				id: 'settings_id-2',
				label: 'Store Info',
				path: '/settings/store',
				icon: <StoreIcon />,
			},
		],
	},
];

export default menuSections;
