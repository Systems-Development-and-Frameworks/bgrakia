const { AuthenticationError, UserInputError } = require('apollo-server-errors');
const { v4: uuidv4 } = require('uuid');
const { delegateToSchema } = require('@graphql-tools/delegate');
const neo4jSchema = require('./neo4j/schema');
const passwordService = require('./services/passwords');
const User = require('./domain/User');

const resolvers = {
  Query: {
    posts: async(parent, args, context, info) => {
      return await delegateToSchema({
        schema: neo4jSchema,
        operation: 'query',
        fieldName: 'Post',
        context,
        info
      });
    },
    users: async(parent, args, context, info) => {
      return await delegateToSchema({
        schema: neo4jSchema,
        operation: 'query',
        fieldName: 'User',
        context,
        info
      });
    },
  },
  Mutation: {
    write: async(parent, args, context, info) => {
      const title = args.post.title;
      return await delegateToSchema({
        schema: neo4jSchema,
        operation: 'mutation',
        fieldName: 'CreatePost',
        args: {
          title,
          votes: 0
        },
        context,
        info
      });
    },
    upvote: async(parent, args, context, info) => {
      const title = args.title;
      const [post] = await delegateToSchema({
        schema: neo4jSchema,
        operation: 'query',
        fieldName: 'Post',
        args: {
          title
        },
        context,
        info
      });

      return await delegateToSchema({
        schema: neo4jSchema,
        operation: 'mutation',
        fieldName: 'UpdatePost',
        args: {
          title,
          votes: post.votes+1
        },
        context,
        info
      });
    },
    signup: async(parent, args, context, info) => {
      let {
        name,
        email,
        password
      } = args;
      const { authService, driver } = context;
      const session = driver.session();

      // Get all records from the database where the emails match.
      // Is atomicity required here? Fetching data doesn't change any state.
      // However, I assume that the driver may implicitly close the session if the transaction fails?
      // TODO: Ask Rob
      const { records: userRecords } = await session.readTransaction((tx) =>
        tx.run("MATCH (n:User) WHERE n.email = $email RETURN n", { email })
      );
      // Check if email is taken
      if (userRecords.length > 0) {
        throw new UserInputError("A user with this email already exists.");
      }
      // Persist user
      const user = new User(name, email, password);
      try {
        await session.writeTransaction((tx) =>
          tx.run("CREATE (u: User {name: $name, email: $email, id:$id, password: $password})", user)
        );
      }
      catch (e) {
        throw new Error("Something went wrong. Please try again.:)");
      }
      finally {
        session.close();
      }
      return authService.issueToken(user.id);
    },
    login: async(parent, args, context, info) => {
      const {
        email,
        password
      } = args;
      const { token, authService, driver } = context;
      const session = driver.session();
      const userId = token.uId;

      const { records: userRecords } = await session.readTransaction((tx) =>
        tx.run("MATCH (u: User) WHERE u.id = $userId RETURN u.password AS pwd", { userId })
      )

      if (userRecords.length === 0) {
        throw new UserInputError("You don't exist.");
      }

      const userPassword = userRecords[0].get('pwd');

      let pwdIsValid = await passwordService.passwordsMatch(password, userPassword);
      if (!pwdIsValid) {
        throw new AuthenticationError("Password is invalid.");
      }

      return context.authService.issueToken(userId);
    }
  }
}

module.exports = resolvers;


