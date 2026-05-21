import { Checkbox, Chip, IconButton, Stack, Tooltip } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';

const useCustomerColumns = ({ onEditClick, onDeleteClick }) => {
	const navigate = useNavigate();

	return [
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
		{ header: 'Name', accessorKey: 'name', enableSorting: false },
		{
			header: 'Email',
			accessorKey: 'email',
			cell: ({ getValue }) => getValue() || 'N/A',
			enableSorting: false,
		},
		{ header: 'Phone', accessorKey: 'phone', enableSorting: false },
		{
			header: 'Created At',
			accessorKey: 'createdAt',
			enableSorting: true,
			cell: ({ getValue }) => new Date(getValue()).toLocaleDateString(),
		},
		{
			header: 'Total Orders',
			accessorKey: '_count.orders',
			enableSorting: false,
		},
		{ header: 'Total Spent', accessorKey: 'totalSpent', enableSorting: true },
		{ header: 'Due Amount', accessorKey: 'totalDue', enableSorting: true },
		{
			header: 'Status',
			accessorKey: 'isActive',
			enableSorting: false,
			cell: ({ getValue }) => (
				<Chip
					label={getValue() ? 'Active' : 'Inactive'}
					size='small'
					color={getValue() ? 'success' : 'error'}
				/>
			),
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
							onClick={() => navigate(`/customers/${row.original.id}`)}>
							<VisibilityIcon fontSize='small' />
						</IconButton>
					</Tooltip>

					<Tooltip title='Edit'>
						<IconButton
							size='small'
							color='primary'
							onClick={() => onEditClick(row.original)}>
							<EditIcon fontSize='small' />
						</IconButton>
					</Tooltip>

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
};

export default useCustomerColumns;
