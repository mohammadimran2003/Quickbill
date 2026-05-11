import {
	Box,
	Paper,
	Table,
	TableContainer,
	Typography,
	TableHead,
	TableRow,
	TableBody,
	TableCell,
	Stack,
	IconButton,
	Tooltip,
	Checkbox,
	Button,
	Popover,
	MenuItem,
	TextField,
	Select,
} from '@mui/material';
import {
	flexRender,
	getCoreRowModel,
	useReactTable,
} from '@tanstack/react-table';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import getCustomers from '../../api/customers_api/getCustomers';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import CircularProgress from '@mui/material/CircularProgress';
import TablePagination from '@mui/material/TablePagination';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ResetIcon from '@mui/icons-material/RestartAlt';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import { useSearchParams } from 'react-router-dom';
import deleteCustomer from '../../api/customers_api/deleteCustomer';
import DeleteConfirmationDialog from '../shared/DeleteConfirmationDialog';
import { toast } from 'sonner';

function CustomerTable({ onEditClick = () => {} }) {
	const [rowSelection, setRowSelection] = useState({});
	const [emailAnchorEl, setEmailAnchorEl] = useState(null);
	const [phoneAnchorEl, setPhoneAnchorEl] = useState(null);
	const [emailFilter, setEmailFilter] = useState('');
	const [phoneFilter, setPhoneFilter] = useState('');
	const [sorting, setSorting] = useState([]);
	const [searchParams, setSearchParams] = useSearchParams();
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [customerToDelete, setCustomerToDelete] = useState(null);

	const navigate = useNavigate();

	const queryClient = useQueryClient();

	const pageNumber = Number(searchParams.get('page'));
	const pageLimit = Number(searchParams.get('limit')) || 1;

	const { data, isLoading, isError } = useQuery({
		queryKey: ['customers', Object.fromEntries(searchParams)],
		queryFn: () => getCustomers(Object.fromEntries(searchParams)),
	});

	const deleteMutation = useMutation({
		mutationFn: deleteCustomer,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['customers'] });
			setDeleteDialogOpen(false);
			setCustomerToDelete(null);
			toast.success('Customer deleted successfully');
		},
		onError: (error) => {
			toast.error(error.response?.data?.message || 'Failed to delete customer');
		},
	});

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
			cell: ({ getValue }) => (getValue() ? 'Active' : 'Inactive'),
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
							onClick={() => {
								setCustomerToDelete(row.original);
								setDeleteDialogOpen(true);
							}}>
							<DeleteIcon fontSize='small' />
						</IconButton>
					</Tooltip>
				</Stack>
			),
		},
	];

	const handlePageChange = (newPage) => {
		setSearchParams((prev) => ({
			...Object.fromEntries(prev),
			page: newPage,
		}));
	};

	const handleLimitChange = (newLimit) => {
		setSearchParams((prev) => ({
			...Object.fromEntries(prev),
			limit: newLimit,
			page: 1,
		}));
		setSearchParams('page, 1');
	};

	const handleEmailApply = () => {
		setSearchParams((prev) => ({
			...Object.fromEntries(prev),
			search: emailFilter,
			page: 1,
		}));
		setEmailFilter('');
		setEmailAnchorEl(null);
	};

	const handlePhoneApply = () => {
		setSearchParams((prev) => ({
			...Object.fromEntries(prev),
			search: phoneFilter,
			page: 1,
		}));
		setPhoneFilter('');
		setPhoneAnchorEl(null);
	};

	const table = useReactTable({
		data: data?.data || [],
		columns,
		getCoreRowModel: getCoreRowModel(),
		state: {
			rowSelection,
			sorting,
		},
		manualPagination: true,
		manualSorting: true,
		rowCount: data?.pagination?.total || 0,
		onRowSelectionChange: setRowSelection,
		onSortingChange: (updater) => {
			const newSorting =
				typeof updater === 'function' ? updater(sorting) : updater;

			setSorting(newSorting);

			setSearchParams((prev) => ({
				...Object.fromEntries(prev),
				sortBy: newSorting[0]?.id || 'createdAt',
				sortOrder: newSorting[0]?.desc ? 'desc' : 'asc',
				page: 1,
			}));
		},
		getRowId: (row) => row.id,
	});

	if (isLoading) return <CircularProgress />;
	if (isError) return <Typography>Something went wrong</Typography>;
	return (
		<Paper
			sx={{
				mt: 2,

				p: 4,
				borderRadius: 4,
				overflowX: 'auto',
			}}>
			<Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
				<Box sx={{ display: 'flex', gap: 2 }}>
					<Button
						variant='outlined'
						startIcon={<AddCircleIcon />}
						onClick={(e) => setEmailAnchorEl(e.currentTarget)}
						sx={{
							color: 'text.primary',
							borderColor: 'divider',
							'&:hover': {
								borderColor: 'text.secondary',
								backgroundColor: 'action.hover',
							},
						}}>
						Email
					</Button>
					<Button
						variant='outlined'
						startIcon={<AddCircleIcon />}
						onClick={(e) => setPhoneAnchorEl(e.currentTarget)}
						sx={{
							color: 'text.primary',
							borderColor: 'divider',
							'&:hover': {
								borderColor: 'text.secondary',
								backgroundColor: 'action.hover',
							},
						}}>
						Phone number
					</Button>
					{searchParams.get('page') && (
						<Button
							variant='outlined'
							startIcon={<ResetIcon />}
							onClick={() => {
								setSearchParams({});
								setEmailFilter('');
								setPhoneFilter('');
							}}>
							Reset
						</Button>
					)}
					{/* Email Filter Popover */}
					<Popover
						open={Boolean(emailAnchorEl)}
						anchorEl={emailAnchorEl}
						onClose={() => setEmailAnchorEl(null)}
						anchorOrigin={{
							vertical: 'bottom',
							horizontal: 'left',
						}}>
						<Box sx={{ p: 3, minWidth: 300 }}>
							<Typography
								variant='h6'
								sx={{ mb: 2 }}>
								Filter by Email
							</Typography>
							<TextField
								fullWidth
								placeholder='Enter email'
								value={emailFilter}
								onChange={(e) => setEmailFilter(e.target.value)}
								size='small'
								sx={{ mb: 2 }}
							/>
							<Button
								variant='contained'
								fullWidth
								onClick={handleEmailApply}>
								Apply
							</Button>
						</Box>
					</Popover>
					{/* Phone Filter Popover */}
					<Popover
						open={Boolean(phoneAnchorEl)}
						anchorEl={phoneAnchorEl}
						onClose={() => setPhoneAnchorEl(null)}
						anchorOrigin={{
							vertical: 'bottom',
							horizontal: 'left',
						}}>
						<Box sx={{ p: 3, minWidth: 300 }}>
							<Typography
								variant='h6'
								sx={{ mb: 2 }}>
								Filter by Phone Number
							</Typography>
							<TextField
								fullWidth
								placeholder='Enter phone number'
								value={phoneFilter}
								onChange={(e) => setPhoneFilter(e.target.value)}
								size='small'
								sx={{ mb: 2 }}
							/>
							<Button
								variant='contained'
								fullWidth
								onClick={handlePhoneApply}>
								Apply
							</Button>
						</Box>
					</Popover>
				</Box>

				<Select
					value={searchParams.get('customerType') || ''}
					onChange={(e) =>
						setSearchParams((prev) => ({
							...Object.fromEntries(prev),
							customerType: e.target.value,
							page: 1,
						}))
					}
					displayEmpty
					color='primary'
					size='small'
					sx={{ minWidth: 150 }}>
					<MenuItem value=''>All Customers</MenuItem>
					<MenuItem value='REGULAR'>Regular</MenuItem>
					<MenuItem value='WHOLESALE'>Wholesale</MenuItem>
					<MenuItem value='VIP'>VIP</MenuItem>
				</Select>
			</Box>
			<TableContainer
				component={Box}
				sx={{
					mt: 2,
					border: '1px solid',
					borderColor: 'divider',
					borderRadius: 4,
				}}>
				{/* Table structure will go here */}
				<Table sx={{ minWidth: 650 }}>
					{/* TableHead and TableBody will be defined here */}
					<TableHead>
						<TableRow>
							{table.getHeaderGroups()[0].headers.map((header) => (
								<TableCell
									key={header.id}
									sx={{ fontWeight: 'bold' }}
									onClick={header.column.getToggleSortingHandler()}>
									<Stack
										direction='row'
										gap={0.5}>
										{flexRender(
											header.column.columnDef.header,
											header.getContext(),
										)}
										{/* Sort Icon */}
										{header.column.getIsSorted() === 'asc' && (
											<ArrowUpwardIcon fontSize='small' />
										)}
										{header.column.getIsSorted() === 'desc' && (
											<ArrowDownwardIcon fontSize='small' />
										)}
										{!header.column.getIsSorted() &&
											header.column.getCanSort() && (
												<UnfoldMoreIcon
													fontSize='small'
													sx={{ color: 'text.disabled' }}
												/>
											)}
									</Stack>
								</TableCell>
							))}
						</TableRow>
					</TableHead>
					<TableBody
						sx={{
							'& tr:last-child td': {
								borderBottom: 0,
							},
						}}>
						{table.getRowModel().rows.length > 0 ?
							table.getRowModel().rows.map((row) => (
								<TableRow
									selected={row.getIsSelected()}
									key={row.id}>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext(),
											)}
										</TableCell>
									))}
								</TableRow>
							))
						:	/* Data na thakle ei Row-ti dekhabe */
							<TableRow>
								<TableCell
									colSpan={columns.length}
									align='center'
									sx={{ py: 8, color: 'text.secondary' }}>
									<Box sx={{ textAlign: 'center' }}>
										<Typography
											variant='h6'
											fontWeight={600}>
											No Customers Found
										</Typography>
										<Typography variant='body2'>
											It looks like you haven't added any customers yet.
										</Typography>
									</Box>
								</TableCell>
							</TableRow>
						}
					</TableBody>
				</Table>
			</TableContainer>
			<TablePagination
				component='div'
				count={data?.pagination?.total || 0}
				page={pageNumber - 1}
				onPageChange={(event, newPage) => {
					handlePageChange(newPage + 1);
				}}
				rowsPerPage={pageLimit}
				onRowsPerPageChange={(event) => {
					handleLimitChange(parseInt(event.target.value, 10));
				}}
				rowsPerPageOptions={[1, 2, 5, 10, 25, 50]}
			/>
			{/* Delete Confirmation Dialog */}
			<DeleteConfirmationDialog
				open={deleteDialogOpen}
				onClose={() => {
					setDeleteDialogOpen(false);
					setCustomerToDelete(null);
				}}
				onConfirm={() => deleteMutation.mutate(customerToDelete.id)}
				title='Delete Customer'
				message={`Are you sure you want to delete "${customerToDelete?.name}"? This action cannot be undone and will permanently remove the customer and all associated data.`}
				loading={deleteMutation.isPending}
			/>
		</Paper>
	);
}

export default CustomerTable;
