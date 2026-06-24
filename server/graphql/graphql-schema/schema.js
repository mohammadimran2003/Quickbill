import DraftOrderType from '../graphql-type/draftsType.js';
import prisma from '../../lib/prisma.js';
import {
	GraphQLSchema,
	GraphQLObjectType,
	GraphQLString,
	GraphQLList,
	GraphQLNonNull,
	GraphQLInputObjectType,
	GraphQLInt,
	GraphQLFloat,
} from 'graphql';

const RootQuery = new GraphQLObjectType({
	name: 'RootQuery',
	description: 'Draft Root query',
	fields: {
		draftList: {
			type: new GraphQLList(DraftOrderType),
			resolve: async () => {
				const data = await prisma.draftOrder.findMany();
				return data;
			},
		},

		draft: {
			type: DraftOrderType,
			args: {
				id: { type: GraphQLString },
			},
			resolve: async (_, { id }) => {
				return await prisma.draftOrder.findUnique({
					where: { id },
				});
			},
		},
	},
});

const DraftItemInputType = new GraphQLInputObjectType({
	name: 'DraftItemInput',
	fields: {
		id: { type: GraphQLString },
		name: { type: GraphQLString },
		quantity: { type: GraphQLInt },
		basePrice: { type: GraphQLInt },
	},
});

const RootMutation = new GraphQLObjectType({
	name: 'Mutation',
	description: 'Draft Mutations',
	fields: {
		createDraftOrder: {
			type: DraftOrderType,
			args: {
				name: { type: GraphQLString },
				customerId: { type: GraphQLString },
				discountType: { type: GraphQLString },
				discountValue: { type: GraphQLFloat },
				items: { type: new GraphQLList(DraftItemInputType) },
			},
			resolve: async (_parent, args, context) => {
				console.log(args, 'create draft args');
				try {
					return await prisma.draftOrder.create({
						data: {
							...args,
							createdBy: context.user.id,
						},
					});
				} catch (error) {
					console.error('Prisma Create Error:', error);
					throw new Error(error.message);
				}
			},
		},

		updateDraft: {
			type: DraftOrderType,
			args: {
				id: { type: GraphQLString },
				customerId: { type: GraphQLString }, // 🛠️ নিশ্চিত করা হলো
				discountType: { type: GraphQLString },
				discountValue: { type: GraphQLFloat },
				items: { type: new GraphQLList(DraftItemInputType) },
			},
			// 🛠️ ডিস্ট্রাকচারিংয়ে customerId যোগ করা হলো
			resolve: async (
				_parent,
				{ id, customerId, discountType, discountValue, items },
			) => {
				console.log('Updating Draft ID:', id);
				try {
					return await prisma.draftOrder.update({
						where: { id },
						data: {
							customerId, // 🛠️ ডাটাবেজে আপডেট করার জন্য পাস করা হলো
							discountType,
							discountValue,
							items,
						},
					});
				} catch (error) {
					console.error('Prisma Update Error:', error);
					throw new Error(error.message);
				}
			},
		},
		deleteDraftOrder: {
			type: GraphQLString,
			args: {
				id: { type: GraphQLString },
			},
			resolve: async (_parent, { id }) => {
				await prisma.draftOrder.delete({
					where: { id },
				});
				return id;
			},
		},
	},
});

export const schema = new GraphQLSchema({
	query: RootQuery,
	mutation: RootMutation,
});
