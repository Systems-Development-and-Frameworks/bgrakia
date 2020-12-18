require('dotenv-flow').config();

// This looks really good, Rob. Thanks for the hint.
const { JWT_SECRET, SALT_ROUNDS } = process.env;
if (! (JWT_SECRET && SALT_ROUNDS)) {
  throw new Error(`Create a .env file and configure environment variables JWT_SECRET and SALT_ROUNDS there.`);
}

module.exports = { JWT_SECRET, SALT_ROUNDS: parseInt(SALT_ROUNDS) };
