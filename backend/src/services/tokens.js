const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../environment');
const bcrypt = require('bcrypt');

const issueToken = (uId) => jwt.sign({ uId }, JWT_SECRET, { algorithm: 'HS256', expiresIn: '1h' });
const verifyToken = (token) => jwt.verify(token, JWT_SECRET);

module.exports = {
  issueToken,
  verifyToken
};
