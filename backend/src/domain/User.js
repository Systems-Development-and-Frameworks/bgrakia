const { hash } = require('../services/passwords');
const { v4: uuidv4 } = require('uuid');

class User {

  constructor(name, email, password) {
    this.name = name;
    this.email = email;
    this.password = hash(password);
    this.id = uuidv4();
  }

  static async save(session, user) {
    const { records: userRecords } = await session.writeTransaction((tx) =>
      tx.run('CREATE (u: User {id: $id, password: $password, email: $email, name: $name}) return u', user)
    );
    return userRecords[0].get('u');
  }
}

module.exports = User;
