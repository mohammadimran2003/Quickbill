import {
	Box,
	Button,
	Popover,
	MenuItem,
	TextField,
	Select,
	Typography,
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ResetIcon from '@mui/icons-material/RestartAlt';
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

function OrderFilterSection({ onSetSorting }) {
	const [invoiceAnchorEl, setInvoiceAnchorEl] = useState(null);
	const [customerNameAnchorEl, setCustomerNameAnchorEl] = useState(null);
	const [invoiceFilter, setInvoiceFilter] = useState('');
	const [customerNameFilter, setCustomerNameFilter] = useState('');
	const [searchParams, setSearchParams] = useSearchParams();

	const handleInvoiceApply = () => {
		setSearchParams((prev) => ({
			...Object.fromEntries(prev),
			invoice: invoiceFilter,
			page: 1,
		}));
		setInvoiceFilter('');
		setInvoiceAnchorEl(null);
	};
	const handleCustomerNameApply = () => {
		setSearchParams((prev) => ({
			...Object.fromEntries(prev),
			name: customerNameFilter,
			page: 1,
		}));
		setCustomerNameFilter('');
		setCustomerNameAnchorEl(null);
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
						onClick={(e) => setInvoiceAnchorEl(e.currentTarget)}
						sx={{
							color: 'text.primary',
							borderColor: 'divider',
							'&:hover': {
								borderColor: 'text.secondary',
								backgroundColor: 'action.hover',
							},
						}}>
						Invoice No
					</Button>
					<Button
						variant='outlined'
						startIcon={<AddCircleIcon />}
						onClick={(e) => setCustomerNameAnchorEl(e.currentTarget)}
						sx={{
							color: 'text.primary',
							borderColor: 'divider',
							'&:hover': {
								borderColor: 'text.secondary',
								backgroundColor: 'action.hover',
							},
						}}>
						Customer name
					</Button>
					{hasFilters && (
						<Button
							variant='outlined'
							startIcon={<ResetIcon />}
							onClick={() => {
								setSearchParams({});
								setInvoiceFilter('');
								onSetSorting();
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
					<MenuItem value='COMPLETED'>COMPLETED</MenuItem>
					<MenuItem value='PARTIAL'>PARTIAL</MenuItem>
					<MenuItem value='PENDING'>PENDING</MenuItem>
				</Select>
			</Box>
			<Popover
				open={Boolean(invoiceAnchorEl)}
				anchorEl={invoiceAnchorEl}
				onClose={() => setInvoiceAnchorEl(null)}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'left',
				}}>
				<Box sx={{ p: 3, minWidth: 300 }}>
					<Typography
						variant='h6'
						sx={{ mb: 2 }}>
						Filter by Invoice No
					</Typography>
					<TextField
						fullWidth
						placeholder='Enter invoice number'
						value={invoiceFilter}
						onChange={(e) => setInvoiceFilter(e.target.value)}
						size='small'
						sx={{ mb: 2 }}
					/>
					<Button
						variant='contained'
						fullWidth
						onClick={handleInvoiceApply}>
						Apply
					</Button>
				</Box>
			</Popover>
			<Popover
				open={Boolean(customerNameAnchorEl)}
				anchorEl={customerNameAnchorEl}
				onClose={() => setCustomerNameAnchorEl(null)}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'left',
				}}>
				<Box sx={{ p: 3, minWidth: 300 }}>
					<Typography
						variant='h6'
						sx={{ mb: 2 }}>
						Filter by Customer name
					</Typography>
					<TextField
						fullWidth
						placeholder='Enter customer name'
						value={customerNameFilter}
						onChange={(e) => setCustomerNameFilter(e.target.value)}
						size='small'
						sx={{ mb: 2 }}
					/>
					<Button
						variant='contained'
						fullWidth
						onClick={handleCustomerNameApply}>
						Apply
					</Button>
				</Box>
			</Popover>
		</>
	);
}

export default OrderFilterSection;
