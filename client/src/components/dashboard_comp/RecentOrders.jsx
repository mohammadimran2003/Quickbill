import {
	useReactTable,
	getCoreRowModel,
	flexRender,
} from '@tanstack/react-table';
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Box,
	Typography,
	Chip,
} from '@mui/material';
import { useEffect, useState } from 'react';
import getRecentOrders from '../../api/dashboard_api/getRecentOrders';

const RecentOrders = () => {
	const [data, setData] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
			// Simulate an API call
			const response = await getRecentOrders();
			setData(response.data);
		};

		fetchData();
	}, []);

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

	// 2. Table Instance
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	return (
		<Paper
			elevation={0}
			sx={{
				p: 3,
				borderRadius: 4,
				bgcolor: '#fff',
				border: '1px solid',
				borderColor: 'divider',
				width: '100%',
			}}>
			{/* Heading Section */}
			<Box sx={{ mb: 3 }}>
				<Typography
					variant='h6'
					fontWeight={700}
					color='text.primary'>
					Recent Orders
				</Typography>
				<Typography
					variant='body2'
					color='text.secondary'>
					Manage and view the latest transactions
				</Typography>
			</Box>

			{/* TanStack Table Section */}
			<TableContainer
				component={Box}
				sx={{ border: 'none' }}>
				<Table sx={{ minWidth: 650 }}>
					<TableHead sx={{ bgcolor: '#f9fafb' }}>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => (
									<TableCell
										key={header.id}
										sx={{
											fontWeight: 700,
											color: 'text.secondary',
											py: 2,
										}}>
										{flexRender(
											header.column.columnDef.header,
											header.getContext(),
										)}
									</TableCell>
								))}
							</TableRow>
						))}
					</TableHead>
					<TableBody>
						{table.getRowModel().rows.map((row) => (
							<TableRow
								key={row.id}
								hover
								sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
								{row.getVisibleCells().map((cell) => (
									<TableCell
										key={cell.id}
										sx={{ py: 2 }}>
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</TableCell>
								))}
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</Paper>
	);
};

export default RecentOrders;
