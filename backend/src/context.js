const jwt = require('jsonwebtoken');

module.exports = ({ req }) => {
    let token = req.headers.authorization || '';
    token = token.replace('Bearer ', '');
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        return { token: decodedToken }
    }
    catch (e) {
        return {}
    }
};