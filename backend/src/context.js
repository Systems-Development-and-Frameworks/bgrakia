const driver = require('./neo4j/db-driver')

module.exports = ({ req, authService }) => {
    const authHeader = (req.headers.authorization || '').replace('Bearer ', '');
    const ctx = { authService, driver };
    try {
        const token = authService.verify(authHeader);
        return { token, ...ctx }
    }
    catch (e) {
        return ctx;
    }
};
