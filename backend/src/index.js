const { ApolloServer, AuthenticationError } = require('apollo-server');
const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');
const UsersAPI = require('./datasources/userApi');
const PostsAPI = require('./datasources/postApi');
const AuthAPI = require('./datasources/authenticationApi');
const { rule, shield, and, or, not, deny, allow, inputRule} = require('graphql-shield');
const jwt = require('jsonwebtoken');
// According to dotenv doc: As early as possible in your application, require and configure dotenv.
require('dotenv').config()
const { applyMiddleware } = require('graphql-middleware')
const { makeExecutableSchema } = require('graphql-tools')

const usersApi = new UsersAPI();
const postsApi = new PostsAPI();
const authApi = new AuthAPI();

// Rules
const isAuthenticated = rule({ cache: 'contextual' })(
  async (parent, args, { token, dataSources }) => {
      const user = dataSources.usersApi.getUserById(token.uId);
      return user !== undefined;
  }
)

const isMyOwn = rule({ cache: 'contextual' })(
  async (parent, args, { token, dataSources }) => {
    const user = await dataSources.usersApi.getUserById(token.uId);
    return user !== undefined && user.email == args.email;
  }
)



const permissions = shield({
  Query: {
    "*": allow,
  },
  User: {
    "*": deny,
    name: allow,
   // email: isMyOwn,
  },
  Post: {
    "*": allow, 
  }, 
  Mutation: {
    "*": allow,  
  }
})


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