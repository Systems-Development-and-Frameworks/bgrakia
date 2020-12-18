const { AuthenticationError } = require('apollo-server-errors');
const { v4: uuidv4 } = require('uuid');
const { delegateToSchema } = require('@graphql-tools/delegate');
const neo4jSchema = require('./neo4j/schema');
const passwordService = require('./services/passwords');

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

      password = await passwordService.hash(password);
      const id = uuidv4();

      /*const user = await delegateToSchema({
        schema: neo4jSchema,
        operation: 'mutation',
        fieldName: 'CreateUser',
        args: {
          id,
          name,
          email,
          password
        },
        context,
        info
      });*/
      return context.authService.issueToken(3);
    },
    login: async(parent, args, context, info) => {
      const {
        email,
        password
      } = args;

      const id = context.token.uId;

      const [user] = await delegateToSchema({
        schema: neo4jSchema,
        operation: 'query',
        fieldName: 'User',
        args: {
          id
        },
        context,
        info
      });

      let pwdIsValid = await passwordService.passwordsMatch(password, user.password);
      if (!pwdIsValid) {
        throw new AuthenticationError("Password is invalid.");
      }

      return context.authService.issueToken(id);
    }
  }
}

module.exports = resolvers;


