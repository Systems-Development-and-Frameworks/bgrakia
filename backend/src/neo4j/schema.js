const { makeAugmentedSchema } = require('neo4j-graphql-js');
const { gql } = require('apollo-server');

const typeDefs = gql`
  type Post {
    title: ID! @id
    votes: Int!
    author: User! @relation(name: "AUTHORED", direction: "OUT")
  }
  
  type User {
    id: ID! 
    name: String!
    email: String!
    password: String!
    posts: [Post] @relation(name: "AUTHORED", direction: "IN")
  }
`;

const neo4jSchema = makeAugmentedSchema({ typeDefs });

module.exports = neo4jSchema;
