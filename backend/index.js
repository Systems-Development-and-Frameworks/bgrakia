const { ApolloServer, gql } = require('apollo-server');

const typeDefs = gql`
  type Post {
    title: String!
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
    # 🚀 OPTIONAL
    # delete(id: ID!): Post

    # ⚠️ FIXME in exercise #4
    # mock voter until we have authentication
    upvote(id: ID!, voter: UserInput!): Post

    # 🚀 OPTIONAL
    # downvote(id: ID!, voter: UserInput!): Post
  }

  input PostInput {
    title: String!

    # ⚠️ FIXME in exercise #4
    # mock author until we have authentication
    author: UserInput!
  }

  input UserInput {
    name: String!
  }
`;