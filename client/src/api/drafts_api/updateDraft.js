import api from '../axios.js';

const updateDraft = async (draftData) => {
	const { id, items } = draftData;

	// 🛠️ ভেরিয়েবলের টাইপ থেকে '!' এবং 'DraftItemInput!' এর '!' সরানো হয়েছে ব্যাকএন্ডের সাথে ম্যাচ করানোর জন্য
	const mutation = `
        mutation UpdateDraft($id: String, $customerId: String, $discountType: String, $discountValue: Float, $items: [DraftItemInput]) {
            updateDraft(id: $id, customerId: $customerId, discountType: $discountType, discountValue: $discountValue, items: $items) {
                id
                name
            }
        }
    `;

	const cleanItems = items.map((item) => {
		return {
			id: String(item.id),
			name: String(item.name),
			quantity: Number(item.quantity || 1),
			basePrice: Number(item.basePrice || 0),
		};
	});

	const response = await api.post(`/graphql`, {
		query: mutation,
		variables: {
			id,
			customerId: draftData.customerId || null,
			discountType: draftData.discountType || 'NONE',
			discountValue: Number(draftData.discountValue || 0),
			items: cleanItems,
		},
	});

	if (response.data?.errors?.length) {
		throw new Error(response.data.errors[0]?.message || 'Failed to update draft');
	}

	const updatedDraft = response.data?.data?.updateDraft;
	if (!updatedDraft) {
		throw new Error('Draft update failed');
	}

	return updatedDraft;
};

export default updateDraft;
