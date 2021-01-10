const { isAuthenticated, canSeeEmail } = require("./rules");
const { shield, and, not, deny, allow} = require('graphql-shield');

const permissions = shield({
    Query: {
      "*": deny,
      users: allow,
      posts: allow,
    },
   /* User: {
      "*": deny,
      name: allow,
      posts: allow,
    },
    Post: {
      "*": allow,
    },*/
    Mutation: {
      "*": deny,
      signup: allow,
      login: allow,// not(isAuthenticated, new Error("Already logged in. Redirect to home page.")),
      write: isAuthenticated,
      upvote: isAuthenticated,
      delete: isAuthenticated
    }
}, {
  allowExternalErrors: true,
});

module.exports = permissions;
