const { ApolloServer } = require('apollo-server');
const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');
const UsersAPI = require('./datasources/userApi');
const PostsAPI = require('./datasources/postApi');


// DO NOT initialize the endpoint inside the dataSources function!
// See https://github.com/apollographql/apollo-server/issues/3150
// Alternatively, set schema.polling.enable to false. (Haven't tested if this works tho)
const usersApi = new UsersAPI();
const postsApi = new PostsAPI();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => {
    return {
      usersApi: usersApi,
      postsApi: postsApi
    }
  }
});
server.listen().then(({url}) => {
  console.log(`Server ready at ${url}`);
})