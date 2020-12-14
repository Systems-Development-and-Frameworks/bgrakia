const { ApolloServer } = require('apollo-server');
const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');
const permissions = require('./security/permissions');
const UsersAPI = require('./datasources/userApi');
const PostsAPI = require('./datasources/postApi');
const AuthAPI = require('./datasources/authenticationApi');
require('dotenv').config();
const { applyMiddleware } = require('graphql-middleware');
const { makeExecutableSchema } = require('graphql-tools');

const usersApi = new UsersAPI();
const postsApi = new PostsAPI();
const authApi = new AuthAPI();

const context = require('./context');

const schema = applyMiddleware(
  makeExecutableSchema({
    typeDefs, 
    resolvers,
  }),
  permissions,
);

const server = new ApolloServer({
  schema,
  context: ({req}) => context({req}),
  dataSources: () => {
    return {
      usersApi: usersApi,
      postsApi: postsApi,
      authApi: authApi,
    }
  }
});


server.listen().then(({url}) => {
  console.log(`Server ready at ${url}`);
});