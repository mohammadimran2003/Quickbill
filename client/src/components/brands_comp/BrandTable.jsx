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
	Chip,
} from '@mui/material';
import {
	flexRender,
	getCoreRowModel,
	useReactTable,
} from '@tanstack/react-table';
import { useState } from 'react';
import getBrands from '../../api/brands_api/getBrands';
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
import { useNavigate, useSearchParams } from 'react-router-dom';
import deleteBrand from '../../api/brands_api/deleteBrand';
import DeleteConfirmationDialog from '../shared/DeleteConfirmationDialog';
import { toast } from 'sonner';

function BrandTable({ onEditClick = () => {} }) {
	const [rowSelection, setRowSelection] = useState({});
	const [nameAnchorEl, setNameAnchorEl] = useState(null);
	const [nameFilter, setNameFilter] = useState('');
	const [sorting, setSorting] = useState([]);
	const [searchParams, setSearchParams] = useSearchParams();
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [brandToDelete, setBrandToDelete] = useState(null);

	const navigate = useNavigate();

	const queryClient = useQueryClient();

	const pageNumber = Number(searchParams.get('page')) || 1;
	const pageLimit = Number(searchParams.get('limit')) || 10;

	const { data, isLoading, isError } = useQuery({
		queryKey: ['brands', Object.fromEntries(searchParams)],
		queryFn: () => getBrands(Object.fromEntries(searchParams)),
	});

	const deleteMutation = useMutation({
		mutationFn: deleteBrand,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['brands'] });
			setDeleteDialogOpen(false);
			setBrandToDelete(null);
			toast.success('Brand deleted successfully');
		},
		onError: (error) => {
			toast.error(error.response?.data?.message || 'Failed to delete brand');
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
							onClick={() => navigate(`/brands/${row.original.id}`)}>
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
								setBrandToDelete(row.original);
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
				sortBy: newSorting[0]?.id || 'name',
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
					sx={{ minWidth: 170 }}>
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
						placeholder='Enter brand name'
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
											No Brands Found
										</Typography>
										<Typography variant='body2'>
											Add your first brand or adjust filters to see brand
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
				rowsPerPageOptions={[2, 5, 10, 25, 50, 100]}
			/>
			<DeleteConfirmationDialog
				open={deleteDialogOpen}
				onClose={() => {
					setDeleteDialogOpen(false);
					setBrandToDelete(null);
				}}
				onConfirm={() => deleteMutation.mutate(brandToDelete.id)}
				title='Delete Brand'
				message={`Are you sure you want to delete "${brandToDelete?.name}"? This action cannot be undone and will permanently remove the brand and all associated products.`}
				loading={deleteMutation.isPending}
			/>
		</Paper>
	);
}

export default BrandTable;
