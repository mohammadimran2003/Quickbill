import { Box, ListItem, Typography, List, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';

import QuantityInput from './QuantityInput';

function CartItem({ items, updateQuantity, removeItem }) {
	return (
		<List disablePadding>
			{items.map((item) => (
				<ListItem
					key={item.id}
					disablePadding
					sx={{
						flexDirection: 'column',
						alignItems: 'stretch',
						mb: 1.5,
						p: 1.5,
						border: '1px solid',
						borderColor: 'divider',
						borderRadius: 2,
						bgcolor: 'background.default',
					}}>
					<Box
						sx={{
							display: 'flex',
							justifyContent: 'space-between',
							mb: 1,
						}}>
						<Typography
							variant='subtitle2'
							fontWeight='bold'
							sx={{
								maxWidth: '85%',
								display: '-webkit-box',
								WebkitLineClamp: 2,
								WebkitBoxOrient: 'vertical',
								overflow: 'hidden',
								textOverflow: 'ellipsis',
							}}>
							{item.name}
						</Typography>
						<IconButton
							size='small'
							color='error'
							onClick={() => removeItem(item.id)}
							sx={{ p: 0.5, mt: -0.5, mr: -0.5 }}>
							<DeleteIcon fontSize='small' />
						</IconButton>
					</Box>

					<Box
						sx={{
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center',
						}}>
						<Typography
							variant='body2'
							color='text.secondary'
							fontWeight='medium'>
							৳{item.basePrice}
						</Typography>

						<Box
							sx={{
								display: 'flex',
								alignItems: 'center',
								border: '1px solid',
								borderColor: 'divider',
								borderRadius: 1,
							}}>
							<IconButton
								size='small'
								onClick={() =>
									updateQuantity(item.id, Math.max(1, item.quantity - 1))
								}
								sx={{ borderRadius: 1 }}>
								<RemoveIcon fontSize='small' />
							</IconButton>
							<QuantityInput
								item={item}
								updateQuantity={updateQuantity}
							/>
							<IconButton
								size='small'
								onClick={() => updateQuantity(item.id, item.quantity + 1)}
								sx={{ borderRadius: 1 }}>
								<AddIcon fontSize='small' />
							</IconButton>
						</Box>

						<Typography
							variant='subtitle2'
							fontWeight='bold'
							color='primary.main'>
							৳{(item.basePrice * item.quantity).toFixed(2)}
						</Typography>
					</Box>
				</ListItem>
			))}
		</List>
	);
}

export default CartItem;
