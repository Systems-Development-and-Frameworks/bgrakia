const { delegateToSchema } = require('@graphql-tools/delegate');
const { UserInputError } = require('apollo-server');
const bcrypt = require('bcrypt');



const Resolvers = ({subschema}) => ({
  Query: {
    posts: async(parent, args, context, info) => {
      const posts = await delegateToSchema({
        schema: subschema,
        operation: 'query',
        fieldName: 'Post',
        context,
        info
      });
      return posts;
    },
    users: async(parent, args, context, info) => {
      const users = await delegateToSchema({
        schema: subschema,
        operation: 'query',
        fieldName: 'User',
        context,
        info
      });
      return users;
    }
  },
  Mutation: {
    write: async (parent, args, context, info) => {
      let {
        title,
      } = args.post;
      const [post] = await delegateToSchema({
        schema: subschema,
        operation: 'mutation',
        fieldName: 'Post',
        args: { title },
        context,
        info
      });
      return post;
      //return await dataSources.postsApi.createPost({ title, author: token.uId });
    },
    upvote: async (parent, args, context, info) => {
      const [post] = await delegateToSchema({
        schema: subschema,
        operation: 'query',
        fieldName: 'Post',
        args: { title: args.title },
        context,
        info
      });
      const [user] = await delegateToSchema({
        schema: subschema,
        operation: 'query',
        fieldName: 'User',
        args: { id: context.token.uId },
        context,
        info
      });

      const isPostUpvoted = post.upvoters.includes(user)
      if (isPostUpvoted) {
        throw new UserInputError("You've already upvoted this post");
      }

      const [updatedPost] = await delegateToSchema({
        schema: subschema,
        operation: 'mutation',
        fieldName: 'Post',
        args: {
          title: post.title,
          upvoters: [user, ...post.upvoters]
        },
        context,
        info
      });
      return updatedPost;
    },
    signup: async (parent, args, context, info) => {
      const saltRounds = parseInt(process.env.SALT_ROUNDS);
      const encryptedPassword = await bcrypt.hash(args.password, saltRounds);

      const createdUser = await delegateToSchema({
        schema: subschema,
        operation: 'mutation',
        fieldName: 'CreateUser',
        //args: { password: encryptedPassword },
        args: {name: args.name, email: args.email, password: encryptedPassword}, //posts: [], upvoted: []},
        context,
        info
      })
      const token = await context.dataSources.authApi.createToken(createdUser.id);
      return token;
    },
    login: async (parent, args, context, info) => {
      const user = await delegateToSchema({
        schema: subschema,
        operation: 'query',
        fieldName: 'User',
        args: args,
        context,
        info
      });
      const token = await context.dataSources.authApi.createToken(user.id);
      return token;
    }
  }
})

module.exports = Resolvers;


/*module.exports = {
    Query: {
      async posts(parent, args, context, info) {
        const posts = await delegateToSchema({
          schema: dbSchema,
          operation: 'query',
          fieldName: 'Post',
          context,
          info
        });
        return posts;
      },
      async users(parent, args, context, info) {
        const users = await delegateToSchema({
          schema: dbSchema,
          operation: 'query',
          fieldName: 'User',
          context,
          info
        });
        return users;
      }
    },

    Mutation: {
      async write(parent, args, context, info) {
        let {
          title,
        } = args.post;
        const [post] = await delegateToSchema({
          schema: dbSchema,
          operation: 'mutation',
          fieldName: 'Post',
          args: { title },
          context,
          info
        });
        return post;
      },
      async upvote(parent, args, context, info) {
        const [post] = await delegateToSchema({
          schema: dbSchema,
          operation: 'query',
          fieldName: 'Post',
          args: { title: args.title },
          context,
          info
        });
        const [user] = await delegateToSchema({
          schema: dbSchema,
          operation: 'query',
          fieldName: 'User',
          args: { id: context.token.uId },
          context,
          info
        });

        const isPostUpvoted = post.upvoters.includes(user)
        if (isPostUpvoted) {
          throw new UserInputError("You've already upvoted this post");
        }

        const [updatedPost] = await delegateToSchema({
          schema: dbSchema,
          operation: 'mutation',
          fieldName: 'Post',
          args: { title: post.title, upvoters: [user, ...post.upvoters] },
          context,
          info
        });
        return updatedPost;
      },
      async signup(parent, args, context, info) {
        const saltRounds = parseInt(process.env.SALT_ROUNDS);
        const encryptedPassword = await bcrypt.hash(args.password, saltRounds);

        const createdUser = await delegateToSchema({
          schema: dbSchema,
          operation: 'query',
          fieldName: 'CreateUser',
          args: { password: encryptedPassword},
          //args: {id: 10, name: args.name, email: args.email, password: encryptedPassword}, //posts: [], upvoted: []},
          context,
          info
        })
        const token = await context.dataSources.authApi.createToken(createdUser.id);
        return token;
      },
      async login(parent, args, context, info) {
        const user = await delegateToSchema({
          schema: dbSchema,
          operation: 'query',
          fieldName: 'User',
          args: args,
          context,
          info
        });
        const token = await context.dataSources.authApi.createToken(user.id);
        return token;

      }
    }
  };*/
