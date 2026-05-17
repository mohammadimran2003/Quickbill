import {
	Box,
	Button,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
} from '@mui/material';
import useCartStore from '../../store/cartStore';
import { useState } from 'react';

function DiscountModal({ open, setOpen }) {
	const { setDiscount, discountType, discountValue } = useCartStore();

	const [tempType, setTempType] = useState(discountType);
	const [tempValue, setTempValue] = useState(discountValue);

	const handleApplyDiscount = () => {
		setDiscount(tempType, Number(tempValue));
		setOpen(false);
	};

	return (
		<Dialog
			open={open}
			onClose={() => setOpen(false)}
			maxWidth='xs'
			fullWidth>
			<DialogTitle>Add Discount</DialogTitle>
			<DialogContent dividers>
				<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
					<FormControl
						fullWidth
						size='small'>
						<InputLabel>Discount Type</InputLabel>
						<Select
							value={tempType}
							label='Discount Type'
							onChange={(e) => setTempType(e.target.value)}>
							<MenuItem value='NONE'>No Discount (৳)</MenuItem>
							<MenuItem value='FLAT'>Flat Amount (৳)</MenuItem>
							<MenuItem value='PERCENT'>Percentage (%)</MenuItem>
						</Select>
					</FormControl>

					<TextField
						fullWidth
						size='small'
						label='Discount Value'
						type='number'
						value={tempValue}
						onChange={(e) => setTempValue(e.target.value)}
						onFocus={(event) => {
							if (event.target.value === '0') {
								event.target.select();
							}
						}}
						slotProps={{
							input: {
								min: 0,
							},
						}}
					/>
				</Box>
			</DialogContent>
			<DialogActions>
				<Button onClick={() => setOpen(false)}>Cancel</Button>
				<Button
					onClick={handleApplyDiscount}
					variant='contained'
					color='primary'>
					Apply
				</Button>
			</DialogActions>
		</Dialog>
	);
}

export default DiscountModal;
