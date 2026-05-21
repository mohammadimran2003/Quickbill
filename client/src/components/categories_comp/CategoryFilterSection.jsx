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

function CategoryFilterSection({ onSetSorting }) {
	const [nameAnchorEl, setNameAnchorEl] = useState(null);
	const [nameFilter, setNameFilter] = useState('');
	const [searchParams, setSearchParams] = useSearchParams();

	const handleNameApply = () => {
		setSearchParams((prev) => ({
			...Object.fromEntries(prev),
			search: nameFilter,
			page: 1,
		}));
		setNameFilter('');
		setNameAnchorEl(null);
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
								if (onSetSorting) onSetSorting([]);
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
		</>
	);
}

export default CategoryFilterSection;
