import { Chip } from '@mui/material';

function getRecentOrderTableColumn() {
	const columns = [
		{ header: 'Invoice Number', accessorKey: 'orderNumber' },
		{ header: 'Customer', accessorKey: 'customer.name' },
		{
			header: 'Date',
			accessorKey: 'createdAt',
			cell: ({ getValue }) => new Date(getValue()).toLocaleDateString(),
		},
		{ header: 'Items', accessorKey: '_count.items' },
		{ header: 'Total', accessorKey: 'total' },
		{ header: 'Payment', accessorKey: 'paymentMethod' },
		{
			header: 'Status',
			accessorKey: 'status',
			cell: ({ row }) => {
				const status = row.original.status; // row er full data nibe

				// Status onujayi color map
				const statusConfig = {
					COMPLETED: { color: 'success', label: 'Paid' },
					PARTIAL: { color: 'warning', label: 'Partial' },
					PENDING: { color: 'error', label: 'Pending' },
					CANCELLED: { color: 'default', label: 'Cancelled' },
				};

				const currentStatus = statusConfig[status] || {
					color: 'default',
					label: status,
				};

				return (
					<Chip
						label={currentStatus.label}
						color={currentStatus.color}
						size='small'
						variant='tonal'
						sx={{ fontWeight: 600, textTransform: 'capitalize' }}
					/>
				);
			},
		},
	];
	return columns;
}

export default getRecentOrderTableColumn;
