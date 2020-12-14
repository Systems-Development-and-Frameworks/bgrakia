const { makeAugmentedSchema } = require('neo4j-graphql-js');
const { gql } = require('apollo-server');

const typeDefs = gql`
  type Post {
    title: ID!
    votes: Int!
    author: User! @relation(name: "POSTED", direction: "IN")
  }

  type User {
    id: ID!
    name: String!
    email: String!
    posts: [Post] @relation(name: "POSTED", direction: "OUT")
  }
`;

const schema = makeAugmentedSchema({ typeDefs })
module.exports = schema;
