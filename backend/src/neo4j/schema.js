const { makeAugmentedSchema } = require('neo4j-graphql-js');
const { gql } = require('apollo-server');



const typeDefs = gql`
   type User {
    id: ID! 
    name: String!
    email: String!
    password: String!
    posts: [Post] @relation(name: "AUTHORED", direction: "OUT")
  }
  
  type Post {
    title: ID! 
    votes: Int!
    author: User! @relation(name: "AUTHORED", direction: "IN")
    upvoters: [User] @relation(name: "LIKED", direction: "IN")
  }
`;

const neo4jSchema = makeAugmentedSchema({ typeDefs });

module.exports = neo4jSchema;
