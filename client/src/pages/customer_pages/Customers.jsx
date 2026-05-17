import { Box, Button, Typography } from '@mui/material';
import { useState } from 'react';
import CustomerTable from '../../components/customers_comp/CustomerTable';
import CustomerModal from '../../components/customers_comp/CustomerModal';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import createCustomer from '../../api/customers_api/createCustomer';
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import updateCustomer from '../../api/customers_api/updateCustomer';

function Customers() {
	const [modalOpen, setModalOpen] = useState(false);
	const [selectedCustomer, setSelectedCustomer] = useState(null);

	const queryClient = useQueryClient();

	const { mutate } = useMutation({
		mutationFn: createCustomer,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['customers'] });
			handleModalClose();
		},
		onError: (err) => {
			toast.error(err.response?.data?.message || 'Something went wrong');
		},
	});

	const { mutate: updateMutate } = useMutation({
		mutationFn: ({ id, data }) => updateCustomer(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['customers'] });
			handleModalClose();
		},
		onError: (err) => {
			toast.error(err.response?.data?.message || 'Something went wrong');
		},
	});

	const handleAddClick = () => {
		setSelectedCustomer(null);
		setModalOpen(true);
	};

	console.log(selectedCustomer, 'se');

	const handleEditClick = (customer) => {
		setSelectedCustomer(customer);
		setModalOpen(true);
	};

	const handleModalClose = () => {
		setModalOpen(false);
		setSelectedCustomer(null);
	};

	const handleSave = async (formData) => {
		if (selectedCustomer) {
			// edit mode
			await toast.promise(
				updateMutate({ id: selectedCustomer.id, data: formData }),
				{
					loading: 'Updating customer...',
					success: 'Customer updated successfully!',
					error: (err) => err.response?.data?.message || 'Something went wrong',
				},
			);
		} else {
			// add mode
			await toast.promise(mutate(formData), {
				loading: 'Saving customer...',
				success: 'Customer created successfully!',
				error: (err) => err.response?.data?.message || 'Something went wrong',
			});
		}
	};

	return (
		<Box sx={{ maxWidth: 1400, mx: 'auto' }}>
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'flex-start',
					flexWrap: 'wrap',
					gap: 2,
					mb: 4,
				}}>
				<Box
					sx={{
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
						width: '100%',
					}}>
					<Typography
						variant='h4'
						fontWeight={900}
						gutterBottom>
						Customer
					</Typography>
					<Button
						variant='contained'
						startIcon={<AddCircleIcon />}
						onClick={handleAddClick}>
						Add
					</Button>
				</Box>
			</Box>
			<CustomerTable onEditClick={handleEditClick} />
			<CustomerModal
				open={modalOpen}
				onClose={handleModalClose}
				onSave={handleSave}
				initialData={selectedCustomer}
			/>
		</Box>
	);
}

export default Customers;
