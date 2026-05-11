import BrandTable from '../../components/brands_comp/BrandTable';
import BrandModal from '../../components/brands_comp/BrandModal';
import PageHeader from '../../components/shared/PageHeader';
import { Box } from '@mui/material';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import createBrand from '../../api/brands_api/createBrand';
import { toast } from 'sonner';

function Brands() {
	const [modalOpen, setModalOpen] = useState(false);
	const [selectedBrand, setSelectedBrand] = useState(null);
	const queryClient = useQueryClient();

	const { mutate } = useMutation({
		mutationFn: createBrand,
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
		console.log(formData, 'Form Data');

		await toast.promise(mutate(formData), {
			success: 'Brand created successfully',
			loading: 'Saving brand',
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
