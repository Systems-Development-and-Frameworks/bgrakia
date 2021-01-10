require('dotenv-flow').config();

// This looks really good, Rob. Thanks for the hint.
const { JWT_SECRET, SALT_ROUNDS, NEO4J_USERNAME, NEO4J_PASSWORD } = process.env;
if (! (JWT_SECRET && SALT_ROUNDS && NEO4J_USERNAME && NEO4J_PASSWORD)) {
  throw new Error(`Create a .env file and configure environment variables JWT_SECRET, SALT_ROUNDS, NEO4J_USERNAME and NEO4J_PASSWORD there.`);
}

module.exports = { JWT_SECRET, SALT_ROUNDS: parseInt(SALT_ROUNDS), NEO4J_USERNAME, NEO4J_PASSWORD };
