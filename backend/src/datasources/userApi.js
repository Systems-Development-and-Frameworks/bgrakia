const { RESTDataSource } = require('apollo-datasource-rest');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

class UsersAPI extends RESTDataSource {
  constructor() {
    super();
      this.users = [];
  }

  async getUserById(id) {
    return this.users.find(user => user.id == id);
  }

  async getUsers() {
    return this.users;
  }

  async getUserByEmail(email) {
    return this.users.find(user => user.email === email);
  }

  async createUser(name, email, password) {
    let obj = {id: uuidv4(), name: name, email: email, posts: [], password: await this.hashPassword(password)};
    this.users.push(obj);
    return obj;
  }

  async hashPassword(password) {
    const saltRounds = parseInt(process.env.SALT_ROUNDS);
    return bcrypt.hash(password, saltRounds);
  }

}

module.exports = UsersAPI;
