import PageHeader from '../../components/shared/PageHeader';
import CategoryTable from '../../components/categories_comp/CategoryTable';
import CategoryModal from '../../components/categories_comp/CategoryModal';
import { Box } from '@mui/material';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import createCategory from '../../api/categories_api/createCategory';
import { toast } from 'sonner';

function Categories() {
	const [modalOpen, setModalOpen] = useState(false);
	const [selectedCategory, setSelectedCategory] = useState(null);
	const queryClient = useQueryClient();
	const { mutate } = useMutation({
		mutationFn: createCategory,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['categories'] });
			handleModalClose();
		},
		onError: (err) => {
			toast.error(err.response?.data?.message || 'Something went wrong');
		},
	});

	const handleAddClick = () => {
		setSelectedCategory(null);
		setModalOpen(true);
	};

	const handleEditClick = (category) => {
		setSelectedCategory(category);
		setModalOpen(true);
	};

	const handleModalClose = () => {
		setModalOpen(false);
		setSelectedCategory(null);
	};

	const handleSave = async (formData) => {
		console.log(formData, 'Form Data');

		await toast.promise(mutate(formData), {
			success: 'Category created successfully',
			loading: 'Saving category',
			error: (err) => err?.response?.data?.message || 'Something went wrong',
		});
	};

	return (
		<Box sx={{ maxWidth: 1400, mx: 'auto', p: 3 }}>
			<PageHeader
				title='Categories'
				btnText='Add Category'
				onBtnClick={handleAddClick}
			/>

			<CategoryTable onEditClick={handleEditClick} />
			<CategoryModal
				open={modalOpen}
				onClose={handleModalClose}
				onSave={handleSave}
				initialData={selectedCategory}
			/>
		</Box>
	);
}

export default Categories;
