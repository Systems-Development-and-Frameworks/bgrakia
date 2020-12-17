const Schema = require('./schema');
const context = require('./context');
const permissions = require('./security/permissions');

module.exports = (ApolloServer, dataSources, opts) => {
  const schema = Schema();
  return new ApolloServer({
    schema,
    context: ({req}) => context({req}),
    dataSources: () => dataSources,
    ...opts
  });
}
