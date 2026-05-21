import { Checkbox, Stack, Tooltip, IconButton } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { formatCurrency } from '../../../utils/formatCurrency';
import { useNavigate } from 'react-router-dom';

function useOrderColumns() {
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
		{ header: 'Invoice No', accessorKey: 'orderNumber', enableSorting: true },
		{
			header: 'Customer',
			accessorKey: 'customer',
			cell: ({ row }) =>
				row.original.customer?.name || row.original.customerId || 'Walk-in',
			enableSorting: false,
		},
		{
			header: 'Items',
			accessorKey: 'items',
			cell: ({ row }) => row.original.items?.length ?? 0,
			enableSorting: false,
		},
		{
			header: 'Subtotal',
			accessorKey: 'subtotal',
			cell: ({ getValue }) =>
				typeof getValue() === 'number' ? formatCurrency(getValue()) : 'N/A',
			enableSorting: true,
		},
		{
			header: 'Discount',
			accessorKey: 'discountAmount',
			cell: ({ getValue }) =>
				typeof getValue() === 'number' ?
					formatCurrency(getValue())
				:	formatCurrency(0),
			enableSorting: true,
		},
		{
			header: 'Total',
			accessorKey: 'total',
			cell: ({ getValue }) =>
				typeof getValue() === 'number' ? formatCurrency(getValue()) : 'N/A',
			enableSorting: true,
		},
		{
			header: 'Payment',
			accessorKey: 'amountPaid',
			cell: ({ getValue }) =>
				typeof getValue() === 'number' ? formatCurrency(getValue()) : 'N/A',
			enableSorting: true,
		},
		{ header: 'Status', accessorKey: 'status', enableSorting: false },
		{
			header: 'Date',
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
					<Tooltip title='View'>
						<IconButton
							size='small'
							color='info'
							onClick={() => navigate(`/orders/${row.original.id}`)}>
							<VisibilityIcon fontSize='small' />
						</IconButton>
					</Tooltip>
				</Stack>
			),
		},
	];

	return columns;
}

export default useOrderColumns;
