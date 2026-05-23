import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Box, Button, MenuItem, Popover, Select, TextField, Typography } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ResetIcon from '@mui/icons-material/RestartAlt';

const filterBtnSx = {
	color: 'text.primary',
	borderColor: 'divider',
	'&:hover': { borderColor: 'text.secondary', backgroundColor: 'action.hover' },
};

const ProductFilterSection = ({ categories, brands, onSetSorting }) => {
	const [nameAnchorEl, setNameAnchorEl] = useState(null);
	const [skuAnchorEl, setSkuAnchorEl] = useState(null);
	const [nameFilter, setNameFilter] = useState('');
	const [skuFilter, setSkuFilter] = useState('');
	const [searchParams, setSearchParams] = useSearchParams();

	const hasFilters = Boolean(searchParams.toString());

	const handleNameFilterApply = () => {
		setSearchParams((prev) => ({
			...Object.fromEntries(prev),
			productName: nameFilter,
			page: 1,
		}));
		setNameAnchorEl(null);
		setNameFilter('');
	};

	const handleSkuFilterApply = () => {
		setSearchParams((prev) => ({
			...Object.fromEntries(prev),
			sku: skuFilter,
			page: 1,
		}));
		setSkuAnchorEl(null);
		setSkuFilter('');
	};

	const handleReset = () => {
		setSearchParams({});
		setNameFilter('');
		setSkuFilter('');
		if (onSetSorting) onSetSorting();
	};

	return (
		<Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
			{/* Left: Search & Reset buttons */}
			<Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
				<Button
					variant='outlined'
					startIcon={<AddCircleIcon />}
					onClick={(e) => setNameAnchorEl(e.currentTarget)}
					sx={filterBtnSx}>
					Name
				</Button>
				<Button
					variant='outlined'
					startIcon={<AddCircleIcon />}
					onClick={(e) => setSkuAnchorEl(e.currentTarget)}
					sx={filterBtnSx}>
					SKU
				</Button>
				{hasFilters && (
					<Button variant='outlined' startIcon={<ResetIcon />} onClick={handleReset}>
						Reset
					</Button>
				)}
			</Box>

			{/* Right: Dropdowns */}
			<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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
						<MenuItem key={cat.id} value={cat.id}>
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
						<MenuItem key={brand.id} value={brand.id}>
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
					size='small'
					sx={{ minWidth: 170 }}>
					<MenuItem value=''>All Products</MenuItem>
					<MenuItem value='SIMPLE'>Simple</MenuItem>
					<MenuItem value='VARIANT'>Variant</MenuItem>
					<MenuItem value='COMPOSITE'>Composite</MenuItem>
				</Select>
			</Box>

			{/* Name Filter Popover */}
			<Popover
				open={Boolean(nameAnchorEl)}
				anchorEl={nameAnchorEl}
				onClose={() => setNameAnchorEl(null)}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}>
				<Box sx={{ p: 3, minWidth: 300 }}>
					<Typography variant='h6' sx={{ mb: 2 }}>
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
					<Button variant='contained' fullWidth onClick={handleNameFilterApply}>
						Apply
					</Button>
				</Box>
			</Popover>

			{/* SKU Filter Popover */}
			<Popover
				open={Boolean(skuAnchorEl)}
				anchorEl={skuAnchorEl}
				onClose={() => setSkuAnchorEl(null)}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}>
				<Box sx={{ p: 3, minWidth: 300 }}>
					<Typography variant='h6' sx={{ mb: 2 }}>
						Filter by SKU
					</Typography>
					<TextField
						fullWidth
						placeholder='Enter SKU'
						value={skuFilter}
						onChange={(e) => setSkuFilter(e.target.value)}
						size='small'
						sx={{ mb: 2 }}
					/>
					<Button variant='contained' fullWidth onClick={handleSkuFilterApply}>
						Apply
					</Button>
				</Box>
			</Popover>
		</Box>
	);
};

export default ProductFilterSection;
