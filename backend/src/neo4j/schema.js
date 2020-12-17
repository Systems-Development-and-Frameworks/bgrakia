const { makeAugmentedSchema } = require('neo4j-graphql-js');
const { gql } = require('apollo-server');

const typeDefs = gql`
  type Post {
    title: ID! @id
    votes: Int!
    author: User! @relation(name: "POSTED", direction: "IN")
    upvoters: [User] @relation(name: "UPVOTED", direction: "IN")
  }

  type User {
    id: ID! @id
    name: String!
    email: String!
    password: String!
    posts: [Post] @relation(name: "POSTED", direction: "OUT")
    upvoted: [Post] @relation(name: "UPVOTED", direction: "OUT")
  }
`;

const schema = makeAugmentedSchema({ typeDefs })
module.exports = schema;
