const { gql } = require('apollo-server');

const typeDefs = gql`
  type Query {
    users: [User]
    posts: [Post]
  }
  
  type Mutation {
    login(email: String!, password: String!): String
    signup(name: String!, email: String!, password: String!): String
    write(post: PostInput!): Post
    upvote(title: ID!): Post
    delete(title: ID!): Post
  }
  
  input PostInput {
    title: String!
  }
  
`;

module.exports = typeDefs;
