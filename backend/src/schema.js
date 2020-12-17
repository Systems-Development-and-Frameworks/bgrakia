const { stitchSchemas } = require('@graphql-tools/stitch');
const typeDefs = require('./typeDefs');
const Resolvers = require('./resolvers');
const dbSchema = require('./neo4j/schema');

module.exports = () => {
  const resolvers = Resolvers({ subschema: dbSchema});
  return stitchSchemas({
    subschemas: [dbSchema],
    typeDefs,
    resolvers
  });
};
