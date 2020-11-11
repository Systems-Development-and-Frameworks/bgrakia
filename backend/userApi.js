const { RESTDataSource } = require('apollo-datasource-rest');

class UsersAPI extends RESTDataSource {
  constructor() {
    super();
    this.users = [
      {
        name: 'Peter',
        posts: [],
      },
      {
        name: 'Max',
        posts: [],
      },
    ];
  }

  async getUser(name) {
    return this.users.find(user => user.name === name);
  }

  async getUsers() {
    return this.users;
  }
}
