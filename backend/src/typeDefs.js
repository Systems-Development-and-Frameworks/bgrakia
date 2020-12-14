const { gql } = require('apollo-server');

module.exports = gql`
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
