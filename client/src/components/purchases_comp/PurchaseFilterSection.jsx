import {
	Box,
	Button,
	Popover,
	TextField,
	Select,
	MenuItem,
	Typography,
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ResetIcon from '@mui/icons-material/RestartAlt';
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

function PurchaseFilterSection({ onSetSorting }) {
	const [purchaseAnchorEl, setPurchaseAnchorEl] = useState(null);
	const [purchaseFilter, setPurchaseFilter] = useState('');
	const [searchParams, setSearchParams] = useSearchParams();

	const handlePurchaseApply = () => {
		setSearchParams((prev) => ({
			...Object.fromEntries(prev),
			search: purchaseFilter,
			page: 1,
		}));
		setPurchaseFilter('');
		setPurchaseAnchorEl(null);
	};

	const hasFilters = Boolean(searchParams.toString());

	return (
		<>
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
						onClick={(e) => setPurchaseAnchorEl(e.currentTarget)}
						sx={{
							color: 'text.primary',
							borderColor: 'divider',
							'&:hover': {
								borderColor: 'text.secondary',
								backgroundColor: 'action.hover',
							},
						}}>
						Search
					</Button>
					{hasFilters && (
						<Button
							variant='outlined'
							startIcon={<ResetIcon />}
							onClick={() => {
								setSearchParams({});
								setPurchaseFilter('');
								if (onSetSorting) onSetSorting([]);
							}}>
							Reset
						</Button>
					)}
				</Box>
				<Select
					value={searchParams.get('status') || ''}
					onChange={(e) =>
						setSearchParams((prev) => ({
							...Object.fromEntries(prev),
							status: e.target.value,
							page: 1,
						}))
					}
					displayEmpty
					color='primary'
					size='small'
					sx={{ minWidth: 170 }}>
					<MenuItem value=''>All Status</MenuItem>
					<MenuItem value='RECEIVED'>Received</MenuItem>
					<MenuItem value='ORDERED'>Ordered</MenuItem>
					<MenuItem value='CANCELLED'>Cancelled</MenuItem>
				</Select>
			</Box>
			<Popover
				open={Boolean(purchaseAnchorEl)}
				anchorEl={purchaseAnchorEl}
				onClose={() => setPurchaseAnchorEl(null)}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'left',
				}}>
				<Box sx={{ p: 3, minWidth: 300 }}>
					<Typography
						variant='h6'
						sx={{ mb: 2 }}>
						Search Purchases
					</Typography>
					<TextField
						fullWidth
						placeholder='Purchase Number or Supplier'
						value={purchaseFilter}
						onChange={(e) => setPurchaseFilter(e.target.value)}
						size='small'
						sx={{ mb: 2 }}
					/>
					<Button
						variant='contained'
						fullWidth
						onClick={handlePurchaseApply}>
						Apply
					</Button>
				</Box>
			</Popover>
		</>
	);
}

export default PurchaseFilterSection;
