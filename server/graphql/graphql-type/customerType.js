import { GraphQLObjectType, GraphQLString } from "graphql";

const customerType = new GraphQLObjectType({
  name: "Customer",
  fields: {
    id: { type: GraphQLString },
    name: { type: GraphQLString },
  },
});

export default customerType;
