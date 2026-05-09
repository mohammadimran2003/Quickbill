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
import getCategories from '../../api/categories_api/getCategories';
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
import { useSearchParams } from 'react-router-dom';

function CategoryTable() {
	const [rowSelection, setRowSelection] = useState({});
	const [nameAnchorEl, setNameAnchorEl] = useState(null);
	const [nameFilter, setNameFilter] = useState('');
	const [sorting, setSorting] = useState([]);
	const [searchParams, setSearchParams] = useSearchParams();

	const pageNumber = Number(searchParams.get('page')) || 1;
	const pageLimit = Number(searchParams.get('limit')) || 10;

	const { data, isLoading, isError } = useQuery({
		queryKey: ['categories', Object.fromEntries(searchParams)],
		queryFn: () => getCategories(Object.fromEntries(searchParams)),
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
		{ header: 'Name', accessorKey: 'name', enableSorting: true },
		{
			header: 'Description',
			accessorKey: 'description',
			cell: ({ getValue }) => getValue() || 'N/A',
			enableSorting: false,
		},
		{
			header: 'Status',
			accessorKey: 'isActive',
			cell: ({ getValue }) => (getValue() ? 'Active' : 'Inactive'),
			enableSorting: false,
		},
		{
			header: 'Date',
			accessorKey: 'createdAt',
			cell: ({ getValue }) => new Date(getValue()).toLocaleDateString(),
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
	};

	const handleNameApply = () => {
		setSearchParams((prev) => ({
			...Object.fromEntries(prev),
			search: nameFilter,
			page: 1,
		}));
		setNameFilter('');
		setNameAnchorEl(null);
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
		rowCount: data?.count || 0,
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

	const hasFilters = Boolean(searchParams.toString());

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
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'space-between',
					gap: 2,
					flexWrap: 'wrap',
				}}>
				<Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
					<Button
						variant='outlined'
						startIcon={<AddCircleIcon />}
						onClick={(e) => setNameAnchorEl(e.currentTarget)}
						sx={{
							color: 'text.primary',
							borderColor: 'divider',
							'&:hover': {
								borderColor: 'text.secondary',
								backgroundColor: 'action.hover',
							},
						}}>
						Name
					</Button>
					{hasFilters && (
						<Button
							variant='outlined'
							startIcon={<ResetIcon />}
							onClick={() => {
								setSearchParams({});
								setNameFilter('');
								setSorting([]);
							}}>
							Reset
						</Button>
					)}
				</Box>
				<Select
					value={searchParams.get('isActive') || ''}
					onChange={(e) =>
						setSearchParams((prev) => ({
							...Object.fromEntries(prev),
							isActive: e.target.value,
							page: 1,
						}))
					}
					displayEmpty
					color='primary'
					size='small'
					sx={{ minWidth: 150 }}>
					<MenuItem value=''>All Status</MenuItem>
					<MenuItem value='true'>Active</MenuItem>
					<MenuItem value='false'>Inactive</MenuItem>
				</Select>
			</Box>
			<Popover
				open={Boolean(nameAnchorEl)}
				anchorEl={nameAnchorEl}
				onClose={() => setNameAnchorEl(null)}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'left',
				}}>
				<Box sx={{ p: 3, minWidth: 300 }}>
					<Typography
						variant='h6'
						sx={{ mb: 2 }}>
						Filter by Name
					</Typography>
					<TextField
						fullWidth
						placeholder='Enter category name'
						value={nameFilter}
						onChange={(e) => setNameFilter(e.target.value)}
						size='small'
						sx={{ mb: 2 }}
					/>
					<Button
						variant='contained'
						fullWidth
						onClick={handleNameApply}>
						Apply
					</Button>
				</Box>
			</Popover>
			<TableContainer
				component={Box}
				sx={{
					mt: 2,
					border: '1px solid',
					borderColor: 'divider',
					borderRadius: 4,
				}}>
				<Table sx={{ minWidth: 650 }}>
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
						:	<TableRow>
								<TableCell
									colSpan={columns.length}
									align='center'
									sx={{ py: 8, color: 'text.secondary' }}>
									<Box sx={{ textAlign: 'center' }}>
										<Typography
											variant='h6'
											fontWeight={600}>
											No Categories Found
										</Typography>
										<Typography variant='body2'>
											Add your first category or adjust filters to see category
											results.
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
				count={data?.count || 0}
				page={pageNumber - 1}
				onPageChange={(event, newPage) => {
					handlePageChange(newPage + 1);
				}}
				rowsPerPage={pageLimit}
				onRowsPerPageChange={(event) => {
					handleLimitChange(parseInt(event.target.value, 10));
				}}
				rowsPerPageOptions={[10, 25, 50, 100]}
			/>
		</Paper>
	);
}

export default CategoryTable;
