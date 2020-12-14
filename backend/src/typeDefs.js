const { gql } = require('apollo-server');

module.exports = gql`
  type Post {
    title: ID!
    votes: Int!
    author: User!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    posts: [Post]
  }

  type Query {
    posts: [Post]
    users: [User]
  }

  type Mutation {
    write(post: PostInput!): Post

    upvote(title: ID!): Post 

    login(email: String!, password: String!): String
   
    signup(name: String!, email: String!, password: String!): String
  }

  input PostInput {
    title: String!
  }
`;