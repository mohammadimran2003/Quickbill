import BrandTable from '../../components/brands_comp/BrandTable';
import BrandModal from '../../components/brands_comp/BrandModal';
import PageHeader from '../../components/shared/PageHeader';
import { Box } from '@mui/material';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import createBrand from '../../api/brands_api/createBrand';
import updateBrand from '../../api/brands_api/updateBrand';
import { toast } from 'sonner';

function Brands() {
	const [modalOpen, setModalOpen] = useState(false);
	const [selectedBrand, setSelectedBrand] = useState(null);
	const queryClient = useQueryClient();

	const createMutation = useMutation({
		mutationFn: createBrand,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['brands'] });
			handleModalClose();
		},
		onError: (err) => {
			toast.error(err.response?.data?.message || 'Something went wrong');
		},
	});

	const updateMutation = useMutation({
		mutationFn: ({ id, data }) => updateBrand(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['brands'] });
			handleModalClose();
		},
		onError: (err) => {
			toast.error(err.response?.data?.message || 'Something went wrong');
		},
	});

	const handleAddClick = () => {
		setSelectedBrand(null);
		setModalOpen(true);
	};

	const handleEditClick = (brand) => {
		setSelectedBrand(brand);
		setModalOpen(true);
	};

	const handleModalClose = () => {
		setModalOpen(false);
		setSelectedBrand(null);
	};

	const handleSave = async (formData) => {
		const action =
			selectedBrand ?
				updateMutation.mutateAsync({ id: selectedBrand.id, data: formData })
			:	createMutation.mutateAsync(formData);

		await toast.promise(action, {
			loading: selectedBrand ? 'Updating brand...' : 'Saving brand...',
			success:
				selectedBrand ?
					'Brand updated successfully'
				:	'Brand created successfully',
			error: (err) => err?.response?.data?.message || 'Something went wrong',
		});
	};

	return (
		<Box sx={{ maxWidth: 1400, mx: 'auto', p: 3 }}>
			<PageHeader
				title='Brands'
				btnText='Add Brand'
				onBtnClick={handleAddClick}
			/>

			<BrandTable onEditClick={handleEditClick} />
			<BrandModal
				open={modalOpen}
				onClose={handleModalClose}
				onSave={handleSave}
				initialData={selectedBrand}
			/>
		</Box>
	);
}

export default Brands;
