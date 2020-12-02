module.exports = {
    Query: {
      async posts(parent, args, { dataSources }) {
        return await dataSources.postsApi.getPosts();
      },
      async users(parent, args, { dataSources }) {
        return await dataSources.usersApi.getUsers();
      }
    },
    User: {
      async posts(parent, args , { dataSources }) {
        const posts = await dataSources.postsApi.getPosts();
        return posts.filter(post => post.author === parent.name);
      }
    },
    Post: {
      author(parent) {
        return {
          name: parent.author
        };
      }
    },
    Mutation: {
      async write(parent, args, { token, dataSources }) {
        let {
          title, 
        } = args.post;     
        return await dataSources.postsApi.createPost({ title, author: token.uId });
      },
      async upvote(parent, args, { token, dataSources }) {
        let postToUpvote = await dataSources.postsApi.getPost(args.title);
        return await dataSources.postsApi.upvotePost(postToUpvote, token.uId);
      },
      async signup(parent, args, { dataSources }) {
        const createdUser = await dataSources.usersApi.createUser(args.name, args.email, args.password);
        const token = await dataSources.authApi.createToken(createdUser.id);
        return token;
      },
      async login(parent, args, { dataSources }) {
        const user = await dataSources.usersApi.getUserByEmail(args.email);
        const token = await dataSources.authApi.createToken(user.id);
        return token;
      }
    }
  };