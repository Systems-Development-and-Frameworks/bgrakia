const { rule } = require('graphql-shield');
const bcrypt = require('bcrypt');
const { delegateToSchema } = require('@graphql-tools/delegate');
const dbSchema = require('../neo4j/schema');

const isAuthenticated = rule({ cache: 'contextual' })(
    async (parent, args, { token, authService, driver }, info) => {
        const { records: userRecords } = await driver.session().readTransaction((tx) =>
          tx.run("MATCH (u: User {id: $id}) return u", { id: token.uId})
        );
        return userRecords.length !== 0;
    }
  );


exports.isAuthenticated = isAuthenticated;
