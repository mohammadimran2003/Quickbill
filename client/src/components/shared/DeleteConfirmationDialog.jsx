import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	Typography,
	Box,
	CircularProgress,
} from '@mui/material';
import { Warning as WarningIcon } from '@mui/icons-material';

const DeleteConfirmationDialog = ({
	open,
	onClose,
	onConfirm,
	title = 'Confirm Delete',
	message = 'Are you sure you want to delete this item? This action cannot be undone.',
	confirmText = 'Delete',
	cancelText = 'Cancel',
	loading = false,
}) => {
	const handleConfirm = async () => {
		try {
			console.log('On confirm');

			await onConfirm();
		} catch (error) {
			console.log(error, 'error');

			// Error handling is done in the parent component
		}
	};

	return (
		<Dialog
			open={open}
			onClose={loading ? undefined : onClose}
			maxWidth='sm'
			fullWidth
			PaperProps={{
				sx: {
					borderRadius: 2,
					padding: 1,
				},
			}}>
			<DialogTitle
				sx={{
					display: 'flex',
					alignItems: 'center',
					gap: 2,
					pb: 1,
				}}>
				<WarningIcon
					color='error'
					sx={{ fontSize: 28 }}
				/>
				<Typography
					variant='h6'
					component='div'
					fontWeight={600}>
					{title}
				</Typography>
			</DialogTitle>

			<DialogContent sx={{ pb: 2 }}>
				<Typography
					variant='body1'
					color='text.secondary'
					sx={{ lineHeight: 1.6 }}>
					{message}
				</Typography>
			</DialogContent>

			<DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
				<Button
					onClick={onClose}
					variant='outlined'
					disabled={loading}
					sx={{ minWidth: 100 }}>
					{cancelText}
				</Button>

				<Button
					onClick={handleConfirm}
					variant='contained'
					color='error'
					disabled={loading}
					sx={{
						minWidth: 100,
						'&:hover': {
							backgroundColor: 'error.dark',
						},
					}}>
					{loading ?
						<Box
							sx={{
								display: 'flex',
								alignItems: 'center',
								gap: 1,
							}}>
							<CircularProgress
								size={16}
								color='inherit'
							/>
							Deleting...
						</Box>
					:	confirmText}
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default DeleteConfirmationDialog;
