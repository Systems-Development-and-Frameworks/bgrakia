const { RESTDataSource } = require('apollo-datasource-rest');
const { isDefinitionNode } = require('graphql');
const { v4: uuidv4 } = require('uuid');

class UsersAPI extends RESTDataSource {
  constructor() {
    super();
    this.users = [
      {
        //id: uuidv4(),
        id: 1,
        name: 'Peter',
        email: 'peter@gmail.com',
        posts: [],
      },
      {
        id: uuidv4(),
        name: 'Max',
        email: 'max@gmail.com',
        posts: [],
      },
    ];
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

  async createUser(name, email) {
    let obj = {id: uuidv4(), name: name, email: email, posts: []};
    this.users.push(obj);
    return obj;
  }

}

module.exports = UsersAPI;