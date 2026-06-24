import {
	GraphQLList,
	GraphQLObjectType,
	GraphQLString,
	GraphQLFloat,
	GraphQLInt,
} from 'graphql';

const DraftItemType = new GraphQLObjectType({
	name: 'DraftItem',
	fields: () => ({
		id: { type: GraphQLString },
		name: { type: GraphQLString },
		quantity: { type: GraphQLInt },
		basePrice: { type: GraphQLInt },
	}),
});

export const DraftOrderType = new GraphQLObjectType({
	name: 'DraftOrder',
	fields: () => ({
		id: { type: GraphQLString },
		name: { type: GraphQLString },
		customerId: { type: GraphQLString },
		createdBy: { type: GraphQLString },
		discountValue: { type: GraphQLFloat },
		discountType: { type: GraphQLString },
		items: { type: new GraphQLList(DraftItemType) },

		createdAt: { type: GraphQLString },
		updatedAt: { type: GraphQLString },
	}),
});

export default DraftOrderType;
