import { useNavigate } from 'react-router-dom';
import { Stack, IconButton, Tooltip, Checkbox, Chip } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PriceTierModal from '../PriceTierModal';

const useProductColumns = ({ onDeleteClick, onEditClick }) => {
	const navigate = useNavigate();

	const columns = [
		{
			id: 'select',
			header: ({ table }) => (
				<Checkbox
					checked={table.getIsAllPageRowsSelected()}
					indeterminate={table.getIsSomePageRowsSelected()}
					onChange={table.getToggleAllPageRowsSelectedHandler()}
				/>
			),
			cell: ({ row }) => (
				<Checkbox
					checked={row.getIsSelected()}
					disabled={!row.getCanSelect()}
					onChange={row.getToggleSelectedHandler()}
				/>
			),
		},
		{ header: 'Name', accessorKey: 'name', enableSorting: true },
		{ header: 'SKU', accessorKey: 'sku', enableSorting: true },
		{
			header: 'Category',
			accessorKey: 'categoryId',
			cell: ({ row }) =>
				row.original.category?.name || row.original.categoryId || 'N/A',
			enableSorting: false,
		},
		{
			header: 'Brand',
			accessorKey: 'brandId',
			cell: ({ row }) =>
				row.original.brand?.name || row.original.brandId || 'N/A',
			enableSorting: false,
		},
		{ header: 'Stock', accessorKey: 'stock', enableSorting: true },
		{ header: 'Unit', accessorKey: 'unit', enableSorting: false },
		{
			header: 'Base Price',
			accessorKey: 'basePrice',
			cell: ({ getValue }) =>
				typeof getValue() === 'number' ? `$${getValue().toFixed(2)}` : 'N/A',
			enableSorting: true,
		},
		{
			header: 'Cost Price',
			accessorKey: 'costPrice',
			cell: ({ getValue }) =>
				typeof getValue() === 'number' ? `$${getValue().toFixed(2)}` : 'N/A',
			enableSorting: true,
		},
		{
			header: 'Status',
			accessorKey: 'isActive',
			cell: ({ getValue }) => (
				<Chip
					label={getValue() ? 'Active' : 'Inactive'}
					size='small'
					color={getValue() ? 'success' : 'error'}
				/>
			),
			enableSorting: false,
		},
		{
			header: 'Created At',
			accessorKey: 'createdAt',
			cell: ({ getValue }) => new Date(getValue()).toLocaleDateString(),
			enableSorting: true,
		},
		{
			header: 'Actions',
			id: 'actions',
			cell: ({ row }) => (
				<Stack
					direction='row'
					spacing={1}>
					<Tooltip title='View Details'>
						<IconButton
							size='small'
							color='info'
							onClick={() => navigate(`/products/${row.original.id}`)}>
							<VisibilityIcon fontSize='small' />
						</IconButton>
					</Tooltip>
					<Tooltip title='Edit'>
						<IconButton
							size='small'
							color='success'
							onClick={() => onEditClick(row.original)}>
							<EditIcon fontSize='small' />
						</IconButton>
					</Tooltip>
					<PriceTierModal product={row.original} />
					<Tooltip title='Delete'>
						<IconButton
							size='small'
							color='error'
							onClick={() => onDeleteClick(row.original)}>
							<DeleteIcon fontSize='small' />
						</IconButton>
					</Tooltip>
				</Stack>
			),
		},
	];

	return columns;
};

export default useProductColumns;
