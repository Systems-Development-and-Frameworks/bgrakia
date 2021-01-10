const { ApolloServer } = require('apollo-server');
const schema = require('./schema');
const context = require('./context');
const authService = require('./services/tokens');

const spawnServer = (opts) => {
  return new ApolloServer({
    schema,
    context: ({ req }) => context({ req, authService }),
    ...opts
  });
}

module.exports = spawnServer;
