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
import getCustomers from '../../api/customers_api/getCustomers';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useQuery } from '@tanstack/react-query';
import CircularProgress from '@mui/material/CircularProgress';
import TablePagination from '@mui/material/TablePagination';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ResetIcon from '@mui/icons-material/RestartAlt';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import theme from '../../theme';

function CustomerTable() {
	const [rowSelection, setRowSelection] = useState({});
	const [emailAnchorEl, setEmailAnchorEl] = useState(null);
	const [phoneAnchorEl, setPhoneAnchorEl] = useState(null);
	const [emailFilter, setEmailFilter] = useState('');
	const [phoneFilter, setPhoneFilter] = useState('');
	const [sorting, setSorting] = useState([]);
	const [params, setParams] = useState({
		page: 1,
		limit: 10,
		search: '',
		customerType: '',
	});

	const { data, isLoading, isError } = useQuery({
		queryKey: ['customers', params],
		queryFn: () =>
			getCustomers({
				...params,
				sortBy: sorting[0]?.id || 'createdAt',
				sortOrder: sorting[0]?.desc ? 'desc' : 'asc',
			}),
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
							onClick={() => console.log('View', row.original.id)}>
							<VisibilityIcon fontSize='small' />
						</IconButton>
					</Tooltip>

					<Tooltip title='Edit'>
						<IconButton
							size='small'
							color='primary'
							onClick={() => console.log('Edit', row.original.id)}>
							<EditIcon fontSize='small' />
						</IconButton>
					</Tooltip>

					<Tooltip title='Delete'>
						<IconButton
							size='small'
							color='error'
							onClick={() => console.log('Delete', row.original.id)}>
							<DeleteIcon fontSize='small' />
						</IconButton>
					</Tooltip>
				</Stack>
			),
		},
	];

	const handlePageChange = (newPage) => {
		setParams((prev) => ({ ...prev, page: newPage }));
	};

	const handleLimitChange = (newLimit) => {
		setParams((prev) => ({ ...prev, limit: newLimit, page: 1 }));
	};

	const handleEmailApply = () => {
		setParams((prev) => ({ ...prev, search: emailFilter, page: 1 }));
		setEmailFilter('');
		setEmailAnchorEl(null);
	};

	const handlePhoneApply = () => {
		setParams((prev) => ({ ...prev, search: phoneFilter, page: 1 }));
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

			setParams((prev) => ({
				...prev,
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
		<Box>
			<Typography variant='h6'>Customer Table</Typography>
			<Typography
				variant='body2'
				color='text.secondary'>
				This is where the customer data will be displayed.
			</Typography>
			<Paper
				sx={{
					mt: 2,
					maxWidth: 1300,
					mx: 'auto',
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
								color: 'text.secondary',
								borderColor: 'divider',
								'&:hover': {
									borderColor: 'primary.main',
									color: 'primary.main',
									backgroundColor: 'transparent',
								},
								'&:focus': {
									borderColor: 'primary.main',
									color: 'primary.main',
								},
							}}>
							Email
						</Button>
						<Button
							variant='outlined'
							startIcon={<AddCircleIcon />}
							onClick={(e) => setPhoneAnchorEl(e.currentTarget)}>
							Phone number
						</Button>
						{params.search && (
							<Button
								variant='outlined'
								startIcon={<ResetIcon />}
								onClick={() => {
									setParams((prev) => ({ ...prev, search: '', page: 1 }));
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
						value={params.customerType || ''}
						onChange={(e) =>
							setParams((prev) => ({
								...prev,
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
					page={params.page - 1}
					onPageChange={(event, newPage) => {
						handlePageChange(newPage + 1);
					}}
					rowsPerPage={params.limit}
					onRowsPerPageChange={(event) => {
						handleLimitChange(parseInt(event.target.value, 10));
					}}
					rowsPerPageOptions={[1, 2, 5, 10, 25, 50]}
				/>
			</Paper>
		</Box>
	);
}

export default CustomerTable;
