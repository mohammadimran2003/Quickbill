import {
	Button,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
} from '@mui/material';
import { useState, useRef } from 'react';
import useCartStore from '../../store/cartStore.js';
import { useMutation } from '@tanstack/react-query';
import createDraft from '../../api/drafts_api/createDraft.js';
import { toast } from 'sonner';
import updateDraft from '../../api/drafts_api/updateDraft.js';

function Drafts() {
	const [open, setOpen] = useState(false);
	const [draftName, setDraftName] = useState('');
	const inputRef = useRef(null);

	const {
		items,
		customer,
		draftData,

		clearCart,
		discountType,
		discountValue,
	} = useCartStore();

	const isDraftLoaded = draftData?.id;

	const handleInitializeDraft = () => {
		const now = new Date();
		const hours = now.getHours();
		const minutes = now.getMinutes();
		const ampm = hours >= 12 ? 'PM' : 'AM';
		const formattedHours = hours % 12 || 12;
		const formattedMinutes = minutes.toString().padStart(2, '0');
		const timeString = `${formattedHours}:${formattedMinutes}${ampm}`;
		const initialDraftName = `${customer?.name} - ${timeString}`;
		setDraftName(initialDraftName);

		setTimeout(() => {
			inputRef.current?.focus();
			inputRef.current?.select();
		}, 100);
	};

	const { mutate: createDraftMutation, isPending } = useMutation({
		mutationFn: (draftData) => createDraft(draftData),
		onSuccess: (data) => {
			console.log(data, 'data from query');

			toast.success('Draft saved successfully');
			setOpen(false);
			clearCart();
		},
		onError: (err) => {
			const serverMessage = err?.response?.data?.message;
			toast.error(serverMessage || 'Failed to save draft');
		},
	});

	const { mutate: updateDraftMutation, isPending: isUpdatePending } =
		useMutation({
			mutationFn: (draftData) => updateDraft(draftData),
			onSuccess: () => {
				toast.success('Draft updated successfully');
				setOpen(false);
				clearCart();
			},
			onError: (err) => {
				const serverMessage = err?.response?.data?.message;
				toast.error(serverMessage || 'Failed to update draft');
			},
		});

	const handleOpen = () => {
		if (items.length === 0) {
			toast.warning('Cart is empty');
			return;
		}
		setOpen(true);
		handleInitializeDraft();
	};

	const handleClose = () => {
		setOpen(false);
	};

	const handleSave = () => {
		const draftData = {
			name: draftName,
			items: items,
			customerId: customer?.id,
			discountType: discountType,
			discountValue: discountValue,
		};

		createDraftMutation(draftData);
	};

	const handleDraftUpdate = () => {
		const updatedDraftData = {
			id: draftData?.id,
			items: items,
			discountType,
			discountValue,
		};

		updateDraftMutation(updatedDraftData);
	};

	return (
		<>
			{isDraftLoaded ?
				<Button
					size='small'
					variant='contained'
					color='secondary'
					onClick={handleDraftUpdate}
					disabled={isUpdatePending}
					sx={{ whiteSpace: 'nowrap' }}>
					Draft Update
				</Button>
			:	<Button
					size='small'
					variant='contained'
					color='secondary'
					onClick={handleOpen}>
					Draft
				</Button>
			}

			<Dialog
				open={open}
				onClose={handleClose}
				maxWidth='xs'
				fullWidth>
				<DialogTitle>Save Draft</DialogTitle>
				<DialogContent>
					<TextField
						autoFocus
						margin='dense'
						label='Draft Name'
						type='text'
						fullWidth
						variant='outlined'
						value={draftName}
						onChange={(e) => setDraftName(e.target.value)}
						inputRef={inputRef}
						disabled={isPending}
					/>
				</DialogContent>
				<DialogActions>
					<Button
						onClick={handleClose}
						disabled={isPending}>
						Cancel
					</Button>
					<Button
						onClick={handleSave}
						variant='contained'
						disabled={isPending || !draftName.trim()}>
						Add
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
}

export default Drafts;
