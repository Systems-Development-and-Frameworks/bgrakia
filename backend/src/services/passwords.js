const bcrypt = require('bcrypt');
const { SALT_ROUNDS } = require('../environment');

const passwordsMatch = async (input, actual) => bcrypt.compareSync(input, actual);
const hash = async (pwd) => bcrypt.hash(pwd, SALT_ROUNDS);

module.exports = {
  hash,
  passwordsMatch
};
