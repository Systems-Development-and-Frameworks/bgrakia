const { ApolloServer, gql } = require('apollo-server');

const typeDefs = gql`
  type Post {
    title: ID!
    votes: Int!
    author: User!
  }

  type User {
    name: ID!
    posts: [Post]
  }

  type Query{
    posts: [Post]
    users: [User]
  }

  type Mutation {
    write(post: PostInput!): Post
    delete(title: ID!): Post
    upvote(title: ID!, voter: UserInput!): Post
    downvote(title: ID!, voter: UserInput!): Post
  }

  input PostInput {
    title: String!
    author: UserInput!
  }

  input UserInput {
    name: String!
  }
`;

const resolvers = {
  Query: {
    posts: () => posts,
    users: () => users,
  },
  Mutation:{
    write(){
      posts
    }
  }
};
