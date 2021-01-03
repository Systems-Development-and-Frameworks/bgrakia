const neo4j = require('neo4j-driver');
// Transaction retry time is 30 seconds by default, which is reasonable.
const driver = neo4j.driver(
  "bolt://localhost:7687",
  neo4j.auth.basic(NEO4J_USERNAME, NEO4J_PASSWORD)
);
module.exports = driver;

