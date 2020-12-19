const { hash } = require('../services/passwords');
const { v4: uuidv4 } = require('uuid');

class User {

  constructor(name, email, password) {
    this.name = name;
    this.email = email;
    this.password = hash(password);
    this.id = uuidv4();
  }

}

module.exports = User;
