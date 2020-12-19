const neo4j = require('neo4j-driver');
// Transaction retry time is 30 seconds by default, which is reasonable.
const driver = neo4j.driver('neo4j://localhost:7687');
module.exports = driver;

