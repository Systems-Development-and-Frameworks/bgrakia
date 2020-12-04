const { isAuthenticated, isPostUpvoted, isPostWithTitlePresent, passwordIsValid, passwordIsTooShort, emailIsTaken, canSeeEmail} = require("./rules");
const { shield, and, not, deny, allow,  chain} = require('graphql-shield');
const { UserInputError } = require('apollo-server');

const permissions = shield({
    Query: {
      "*": allow,
    },
    User: {
      "*": deny,
      name: allow,
      email: and(isAuthenticated, canSeeEmail),
    },
    Post: {
      "*": allow, 
    }, 
    Mutation: {
      "*": deny,
      signup: and(
        not(emailIsTaken, new UserInputError("A user with this email already exists.")),
        not(passwordIsTooShort, new UserInputError("The password must be at least 8 characters long."))
      ), 
      login: chain(
        // This may look strange, but if an already authenticated user authenticates (logs in) a second time, she'll have two tokens! This is not good practice.
        // There are two options: either implement a cache layer for the tokens, or just disallow authenticated users to login a second time. 
        not(isAuthenticated, new Error("Already logged in. Redirect to home page.")), 
        not(passwordIsTooShort, new UserInputError("The password must be at least 8 characters long.")),
        passwordIsValid,
      ),
      write: and(
        isAuthenticated,
        not(isPostWithTitlePresent, new UserInputError("Post with this title already exists."))
      ),
      upvote: and(
        isAuthenticated,
        isPostWithTitlePresent,
        not(isPostUpvoted, new UserInputError("You've already upvoted this post"))
      )
    }
}); 

module.exports = permissions;