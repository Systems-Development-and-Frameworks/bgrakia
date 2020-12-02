const { RESTDataSource } = require('apollo-datasource-rest');
const { isDefinitionNode } = require('graphql');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

class UsersAPI extends RESTDataSource {
  constructor() {
    super();
    this.users = [];
  }

  async getUserByName(name) {
    return this.users.find(user => user.name === name);
  }

  async getUserById(id) {
    return this.users.find(user => user.id == id);
  }

  async getUsers() {
    return this.users;
  }

  async isEmailTaken(email) {
    const user = this.users.find(user => user.email === email);
    return user !== undefined;
  }

  async isPasswordValid(pwd) {
    return pwd.length >= 8;
  }

  async createUser(name, email, password) {
    let obj = {id: uuidv4(), name: name, email: email, posts: [], password: this.hashPassword(password)};
    this.users.push(obj);
    return obj;
  }

  async hashPassword(password) {
    const saltRounds = parseInt(process.env.SALT_ROUNDS);
    return bcrypt.hashSync(password, saltRounds);
  }

   async checkPassword(uId, password) {
      const user = this.getUserById(uId);
      return user !== undefined && bcrypt.compareSync(password, user.password)
    }
}

module.exports = UsersAPI;