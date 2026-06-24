import api from '../axios.js';

const getDraftsGraphQL = async () => {
	const query = `
    query {
      draftList {
        id
        name
        customerId
        createdBy
        discountValue
        discountType
        items {
          id
          name
          quantity
          basePrice
          
        }
      }
    }
  `;

	const response = await api.post('/graphql', { query });
	return response.data.data.draftList;
};

export default getDraftsGraphQL;
