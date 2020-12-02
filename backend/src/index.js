const { ApolloServer } = require('apollo-server');
const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');
const permissions = require('./security/permissions');
const UsersAPI = require('./datasources/userApi');
const PostsAPI = require('./datasources/postApi');
const AuthAPI = require('./datasources/authenticationApi');
const jwt = require('jsonwebtoken');
require('dotenv').config()
const { applyMiddleware } = require('graphql-middleware')
const { makeExecutableSchema } = require('graphql-tools')

const usersApi = new UsersAPI();
const postsApi = new PostsAPI();
const authApi = new AuthAPI();

const schema = applyMiddleware(
  makeExecutableSchema({
    typeDefs, 
    resolvers,
  }),
  permissions,
)

const server = new ApolloServer({
  schema,
  context: async ({ req }) => {
    let token = req.headers.authorization || '';
    token = token.replace('Bearer ', '');
    try {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      return { token: decodedToken }
    }
    catch (e) {
      return {}
    }
  },
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
})