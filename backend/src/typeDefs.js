const { gql } = require('apollo-server');

module.exports = gql`
  type Post {
    title: ID!
    votes: Int!
    author: User!
  }

  type User {
    name: ID!
    posts: [Post]
  }

  type Query {
    posts: [Post]
    users: [User]
  }

  type Mutation {
    write(post: PostInput!): Post
    #delete(title: ID!): Post
    upvote(title: ID!, voter: UserInput!): Post
    #downvote(title: ID!, voter: UserInput!): Post
  }

  input PostInput {
    title: String!
    author: UserInput!
  }

  input UserInput {
    name: String!
  }
`;