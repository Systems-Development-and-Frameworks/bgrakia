const jwt = require('jsonwebtoken');
const driver = require('./neo4j/db-driver')
module.exports = ({ req }) => {
    let token = req.headers.authorization || '';
    token = token.replace('Bearer ', '');
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        return { token: decodedToken, driver }
    }
    catch (e) {
        return { driver }
    }
};
