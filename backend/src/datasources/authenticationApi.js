const { RESTDataSource } = require('apollo-datasource-rest');
const jwt = require('jsonwebtoken');

class AuthAPI extends RESTDataSource {

    constructor() { super(); }

    async createToken(userId) {
        return jwt.sign({ uId: userId }, process.env.JWT_SECRET, { algorithm: 'HS256' });
    }

    /*async verifyToken(token) {
        return jwt.verify(token, process.env.JWT_SECRET);
    }*/
}

module.exports = AuthAPI;