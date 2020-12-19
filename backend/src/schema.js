const { applyMiddleware } = require('graphql-middleware');
const { stitchSchemas } = require('@graphql-tools/stitch');
const permissions = require('./security/permissions');
const resolvers = require('./resolvers');
const typeDefs = require('./typeDefs');
const neo4jSchema = require('./neo4j/schema');

const gatewaySchema = stitchSchemas({
  subschemas: [ { schema: neo4jSchema }],
  typeDefs,
  resolvers
});

//const schemaWithSchields = applyMiddleware(gatewaySchema, permissions);

module.exports = gatewaySchema;

