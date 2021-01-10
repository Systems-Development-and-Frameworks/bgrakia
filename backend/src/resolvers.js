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
      const { token, authService, driver } = context;
      const session = driver.session();

      const [existingPost] = await delegateToSchema({
        schema: neo4jSchema,
        operation: 'query',
        fieldName: 'Post',
        args: { title },
        context,
        info
      });
      if (existingPost !== undefined) {
        throw new UserInputError("Post with this title already exists.");
      }

      const { records: postRecords } = await session.writeTransaction((tx) =>
        tx.run("CREATE (p: Post {title: $title, votes: 0}) RETURN p", { title })
      );
      if (postRecords.length === 0) {
        throw new Error("Could not create post.");
      }

      const {records: relRecords} = await session.writeTransaction(tx =>
        tx.run("MATCH (p: Post {title: $title}), (u: User {id: $id}) CREATE (p)<-[:AUTHORED]-(u) RETURN p",
          {title, id: token.uId})
      );

      const [post] = await delegateToSchema({
        schema: neo4jSchema,
        operation: 'query',
        fieldName: 'Post',
        args: { title },
        context,
        info
      });
      return post;
    },
    upvote: async(parent, args, context, info) => {
      const title = args.title;
      const { token, authService, driver } = context;

      const [post] = await delegateToSchema({
        schema: neo4jSchema,
        operation: 'query',
        fieldName: 'Post',
        args,
        context,
        info
      });
      if (post === undefined) {
        throw new UserInputError("Post does not exist");
      }

      const { records: userRecords } = await driver.session().readTransaction((tx) =>
        tx.run("MATCH (u: User {id: $id})-[:LIKED]->(p: Post {title: $title}) return u", { id: token.uId, title})
      );

      if (userRecords.length !== 0) {
        throw new UserInputError("You have already upvoted this post.");
      }

      await driver.session().writeTransaction((tx) =>
        tx.run("MATCH (u: User {id: $id}), (p: Post {title: $title}) CREATE (u)-[:LIKED]->(p) return p", {id: token.uId, title})
      );

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
    signup: async(_, args, context, info) => {
      let { name, email, password } = args;
      if (password.length < 8) {
        throw new UserInputError("The password must be at least 8 characters long.");
      }

      const { authService, driver } = context;

      const session = driver.session();
      const transactionHandler = session.beginTransaction();
      try {
        const { records: userRecords } = await transactionHandler.run(
          "MATCH (u:User) WHERE u.email = $email RETURN u.password AS pwd, u.id as id",
          { email }
        );
        if (userRecords.length !== 0) {
          throw new UserInputError("A user with this email already exists.");
        }

        const user = new User(name, email, password);
        const { records } = await transactionHandler.run(
          "CREATE (u: User {id: $id, name: $name, email: $email, password: $password}) RETURN u.id as uId",
          user
        );
        if (records.length === 0) {
          throw new Error("Could not create user");
        }

        const uId = records[0].get('uId');
        const token = authService.issueToken(uId);

        await transactionHandler.commit();
        return token;
      }
      catch (e) {
        await transactionHandler.rollback();
        throw e;
      }
      finally {
        await session.close();
      }
    },
    login: async(parent, args, context, info) => {
      const {
        email,
        password
      } = args;
      const { authService, driver } = context;
      const session = driver.session();

      try {
        const { records: userRecords } = await session.readTransaction((tx) =>
          tx.run("MATCH (u:User) WHERE u.email = $email RETURN u.password AS pwd, u.id as id", { email })
        );

        if (userRecords.length === 0) {
          throw new UserInputError("You don't exist.");
        }

        const userPassword = userRecords[0].get('pwd');
        let pwdIsValid = await passwordService.passwordsMatch(password, userPassword);
        if (!pwdIsValid) {
          throw new AuthenticationError("Password is invalid.");
        }
        const userId = userRecords[0].get('id');
        return authService.issueToken(userId);
      }
      finally {
        await session.close();
      }
    },
    delete: async(parent, args, context, info) => {
      const { title } = args;
      const { token, authService, driver } = context;
      const session = driver.session();

      const { records: authorRecords} = await session.readTransaction((tx) =>
        tx.run("MATCH (u: User)-[:AUTHORED]->(p: Post {title: $title}) RETURN u.id as uId", { title })
      );

      const authorId = authorRecords[0].get('uId');
      if (authorId !== token.uId) {
        throw new UserInputError("This is not your post!");
      }

      return await delegateToSchema({
        schema: neo4jSchema,
        operation: 'mutation',
        fieldName: 'DeletePost',
        args,
        context,
        info
      })
    }
  },
}

module.exports = resolvers;


