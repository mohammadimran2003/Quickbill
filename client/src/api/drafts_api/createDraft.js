import api from '../axios.js';

const createDraft = async (draftData) => {
	const mutation = `
    mutation CreateDraft($name: String, $customerId: String, $discountType: String, $discountValue: Float, $items: [DraftItemInput]) {
      createDraftOrder(name: $name, customerId: $customerId, discountType: $discountType, discountValue: $discountValue, items: $items) {
        id
        name
      }
    }
  `;

	const cleanItems = draftData.items.map((item) => {
		return {
			id: String(item.id),
			name: String(item.name),
			quantity: Number(item.quantity),
			basePrice: Number(item.basePrice),
		};
	});

	const response = await api.post('/graphql', {
		query: mutation,
		variables: {
			name: draftData.name,
			customerId: draftData.customerId,
			discountType: draftData.discountType,
			discountValue: Number(draftData.discountValue || 0),
			items: cleanItems,
		},
	});

	if (response.data?.errors?.length) {
		throw new Error(
			response.data.errors[0]?.message || 'Failed to create draft',
		);
	}

	const draftOrder = response.data?.data?.createDraftOrder;
	if (!draftOrder) {
		throw new Error('Draft creation failed');
	}

	return draftOrder;
};

export default createDraft;
