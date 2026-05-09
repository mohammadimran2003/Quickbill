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
import getProducts from '../../api/products_api/getProducts';
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
import getCategories from '../../api/categories_api/getCategories';
import getBrands from '../../api/brands_api/getBrands';

function ProductTable() {
	const [rowSelection, setRowSelection] = useState({});
	const [nameAnchorEl, setNameAnchorEl] = useState(null);
	const [skuAnchorEl, setSkuAnchorEl] = useState(null);
	const [sorting, setSorting] = useState([]);
	const [searchParams, setSearchParams] = useSearchParams();
	const [nameFilter, setNameFilter] = useState('');
	const [skuFilter, setSkuFilter] = useState('');

	const pageNumber = Number(searchParams.get('page')) || 1;
	const pageLimit = Number(searchParams.get('limit')) || 10;

	const { data, isLoading, isError } = useQuery({
		queryKey: ['products', Object.fromEntries(searchParams)],
		queryFn: () => getProducts(Object.fromEntries(searchParams)),
	});

	const { data: categories } = useQuery({
		queryKey: ['categories'],
		queryFn: () => getCategories(),
	});

	const { data: brands } = useQuery({
		queryKey: ['brands'],
		queryFn: () => getBrands(),
	});

	console.log(data, 'data');

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
			cell: ({ getValue }) => (getValue() ? 'Active' : 'Inactive'),
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

	const handleNameFilterApply = () => {
		setSearchParams((prev) => ({
			...Object.fromEntries(prev),
			search: nameFilter,
			page: 1,
		}));
		setNameAnchorEl(null);
	};

	const handleSkuFilterApply = () => {
		setSearchParams((prev) => ({
			...Object.fromEntries(prev),
			search: skuFilter,
			page: 1,
		}));
		setSkuAnchorEl(null);
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
					<Button
						variant='outlined'
						startIcon={<AddCircleIcon />}
						onClick={(e) => setSkuAnchorEl(e.currentTarget)}
						sx={{
							color: 'text.primary',
							borderColor: 'divider',
							'&:hover': {
								borderColor: 'text.secondary',
								backgroundColor: 'action.hover',
							},
						}}>
						SKU
					</Button>
					{hasFilters && (
						<Button
							variant='outlined'
							startIcon={<ResetIcon />}
							onClick={() => {
								setSearchParams({});

								setSorting([]);
							}}>
							Reset
						</Button>
					)}
				</Box>
				<Box
					sx={{
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						gap: 2,
					}}>
					<Select
						value={searchParams.get('category') || ''}
						onChange={(e) =>
							setSearchParams((prev) => ({
								...Object.fromEntries(prev),
								category: e.target.value,
								page: 1,
							}))
						}
						displayEmpty
						size='small'
						sx={{ minWidth: 170 }}>
						<MenuItem value=''>All Categories</MenuItem>
						{categories?.data?.map((cat) => (
							<MenuItem
								key={cat.id}
								value={cat.id}>
								{cat.name}
							</MenuItem>
						))}
					</Select>
					<Select
						value={searchParams.get('brand') || ''}
						onChange={(e) =>
							setSearchParams((prev) => ({
								...Object.fromEntries(prev),
								brand: e.target.value,
								page: 1,
							}))
						}
						displayEmpty
						size='small'
						sx={{ minWidth: 170 }}>
						<MenuItem value=''>All Brands</MenuItem>
						{brands?.data?.map((brand) => (
							<MenuItem
								key={brand.id}
								value={brand.id}>
								{brand.name}
							</MenuItem>
						))}
					</Select>
					<Select
						value={searchParams.get('productType') || ''}
						onChange={(e) =>
							setSearchParams((prev) => ({
								...Object.fromEntries(prev),
								productType: e.target.value,
								page: 1,
							}))
						}
						displayEmpty
						color='primary'
						size='small'
						sx={{ minWidth: 170 }}>
						<MenuItem value=''>All Products</MenuItem>
						<MenuItem value='SIMPLE'>Simple</MenuItem>
						<MenuItem value='VARIANT'>Variant</MenuItem>
						<MenuItem value='COMPOSITE'>Composite</MenuItem>
					</Select>
				</Box>
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
						placeholder='Enter product name'
						value={nameFilter}
						onChange={(e) => setNameFilter(e.target.value)}
						size='small'
						sx={{ mb: 2 }}
					/>
					<Button
						variant='contained'
						fullWidth
						onClick={handleNameFilterApply}>
						Apply
					</Button>
				</Box>
			</Popover>
			<Popover
				open={Boolean(skuAnchorEl)}
				anchorEl={skuAnchorEl}
				onClose={() => setSkuAnchorEl(null)}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'left',
				}}>
				<Box sx={{ p: 3, minWidth: 300 }}>
					<Typography
						variant='h6'
						sx={{ mb: 2 }}>
						Filter by SKU
					</Typography>
					<TextField
						fullWidth
						placeholder='Enter brand name'
						value={skuFilter}
						onChange={(e) => setSkuFilter(e.target.value)}
						size='small'
						sx={{ mb: 2 }}
					/>
					<Button
						variant='contained'
						fullWidth
						onClick={handleSkuFilterApply}>
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
											No Products Found
										</Typography>
										<Typography variant='body2'>
											Add your first product or adjust filters to see product
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

export default ProductTable;
