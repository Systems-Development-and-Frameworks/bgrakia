const { stitchSchemas } = require('@graphql-tools/stitch');
const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');
const dbSchema = require('./neo4j/schema');

module.exports = stitchSchemas({
  subschemas: [dbSchema],
  typeDefs,
  resolvers
});
