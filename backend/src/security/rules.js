const { rule } = require('graphql-shield');
const bcrypt = require('bcrypt');


const isAuthenticated = rule({ cache: 'contextual' })(
    async (parent, args, { token, dataSources }) => {
        const user = await dataSources.usersApi.getUserById(token.uId);
        return user !== undefined;
    }
  );
  
const canSeeEmail = rule({ cache: 'strict' })(
    async (parent, args, { token }) => {
        return token.uId === parent.id; 
    }
);

const emailIsTaken = rule({ cache: 'strict' })(
    async(parent, args, { token, dataSources }) => {
        const user = await dataSources.usersApi.getUserByEmail(args.email);
        return user !== undefined;
    }
);

const passwordIsTooShort = rule({ cache: 'strict' })(
    async(parent, args, { token, dataSources }) => {
        return args.password.length < 8;
    }
);

const passwordIsValid = rule({ cache: 'strict' })(
    async (parent, args, { dataSources }) => {
        const user = await dataSources.usersApi.getUserByEmail(args.email);
        return user !== undefined && bcrypt.compareSync(args.password, user.password);
    }
);

const isPostWithTitlePresent = rule({ cache: 'strict'})(
    async (parent, args, { dataSources }) => {
        let title;
        if (args.post === undefined) {
            title = args.title;
        }
        else {
            title = args.post.title
        }

        const post = await dataSources.postsApi.getPost(title);
        return post !== undefined;
    }
);

const isPostUpvoted = rule({ cache: 'strict'})(
    async (parent, args, { dataSources, token }) => {
        const title = args.title;
        const post = await dataSources.postsApi.getPost(title);
        return post.upvoters.includes(token.uId);
    }
);

exports.isAuthenticated = isAuthenticated;
exports.isPostUpvoted = isPostUpvoted;
exports.isPostWithTitlePresent = isPostWithTitlePresent;
exports.passwordIsValid = passwordIsValid;
exports.passwordIsTooShort = passwordIsTooShort;
exports.emailIsTaken = emailIsTaken;
exports.canSeeEmail = canSeeEmail;