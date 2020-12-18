const { rule } = require('graphql-shield');
const bcrypt = require('bcrypt');
const { delegateToSchema } = require('@graphql-tools/delegate');
const dbSchema = require('../neo4j/schema');

const isAuthenticated = rule({ cache: 'contextual' })(
    async (parent, args, context, info) => {
        const [user] = await delegateToSchema({
          schema: dbSchema,
          operation: 'query',
          fieldName: 'User',
          args: {
            id: context.token.uId
          },
          context,
          info
        })
        return user !== undefined;
    }
  );

const canSeeEmail = rule({ cache: 'strict' })(
    async (parent, args, { token }) => {
        return token.uId === parent.id;
    }
);

const emailIsTaken = rule({ cache: 'strict' })(
    async(parent, args, context, info) => {
        const user = await delegateToSchema({
          schema: dbSchema,
          operation: 'query',
          fieldName: 'User',
          args: args,
          context,
          info
        })
        //const user = await dataSources.usersApi.getUserByEmail(args.email);
        return user !== undefined;
    }
);

const passwordIsTooShort = rule({ cache: 'strict' })(
    async(parent, args, { token, dataSources }) => {
        return args.password.length < 8;
    }
);

const passwordIsValid = rule({ cache: 'strict' })(
    async (parent, args, context, info) => {
        const [user] = await delegateToSchema({
          schema: dbSchema,
          operation: 'query',
          fieldName: 'User',
          args: args,
          context,
          info
        })
        //const user = await dataSources.usersApi.getUserByEmail(args.email);
        return user !== undefined && bcrypt.compareSync(args.password, user.password);
    }
);

const isPostWithTitlePresent = rule({ cache: 'strict'})(
    async (parent, args, context, info) => {
        let title;
        if (args.post === undefined) {
            title = args.title;
        }
        else {
            title = args.post.title
        }
        const [post] = await delegateToSchema({
          schema: dbSchema,
          operation: 'query',
          fieldName: 'Post',
          args: { title },
          context,
          info
        })
        //const post = await dataSources.postsApi.getPost(title);
        return post !== undefined;
    }
);

const isPostUpvoted = rule({ cache: 'strict'})(
    async (parent, args, context, info) => {
        const title = args.title;
        const [post] = await delegateToSchema({
          schema: dbSchema,
          operation: 'query',
          fieldName: 'Post',
          args: { title },
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

        //const post = await dataSources.postsApi.getPost(title);
        return post.upvoters.includes(user);
    }
);

exports.isAuthenticated = isAuthenticated;
exports.isPostUpvoted = isPostUpvoted;
exports.isPostWithTitlePresent = isPostWithTitlePresent;
exports.passwordIsValid = passwordIsValid;
exports.passwordIsTooShort = passwordIsTooShort;
exports.emailIsTaken = emailIsTaken;
exports.canSeeEmail = canSeeEmail;
