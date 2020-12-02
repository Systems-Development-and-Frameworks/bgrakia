const { UserInputError } = require('apollo-server');

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
        //  author: {name}
        } = args.post;
        
        // Check if a post with the title already exists.
        let persistedPost = await dataSources.postsApi.getPost(title);
        if (persistedPost !== undefined) {
          throw new UserInputError("Post with this title already exists.", {invalidArgs: [title]});
        }
  
        // Check if the author exists 
       /* let author = await dataSources.usersApi.getUserById(token.uId);
        if (author === undefined) {
          throw new UserInputError("No such author.", {invalidArgs: [token.uId]});
        }*/
  
        return await dataSources.postsApi.createPost({ title, author: token.uId });
      },
      async upvote(parent, args, { token, dataSources }) {
        // Why must we mock the current user? We have him right here, in the voter field?
  
        let postToUpvote = await dataSources.postsApi.getPost(args.title);
        if (postToUpvote === undefined) {
          throw new UserInputError("Post with this title doesn't exist", {invalidArgs: [args.title]});
        }
  
        /*let upvoter = await dataSources.usersApi.getUserById(token.uId);
        if (upvoter === undefined) {
          throw new UserInputError("No such voter.", {invalidArgs: [args.voter]});
        }*/
  
        let alreadyVoted = postToUpvote.upvoters.includes(token.uId);
        if (alreadyVoted) {
          throw new UserInputError("This voter has already upvoted this article", {invalidArgs: [args.title, token.uId]});
        }
  
        return await dataSources.postsApi.upvotePost(postToUpvote, token.uId);
      },
      async signup(parent, args, { dataSources }) {
        const pwdIsNotValid = await !dataSources.usersApi.isPasswordValid(args.password);
        const emailIsTaken = await dataSources.usersApi.isEmailTaken(args.email);
        console.log('ENTERED RESOLVER', pwdIsNotValid, emailIsTaken);
        if (emailIsTaken) {
          throw new UserInputError("This email is already taken", {invalidArgs: [args.email]});
        }
        if (pwdIsNotValid) {
          throw new UserInputError("Password must be at least 8 characters long.", {invalidArgs: [args.password]});
        }

        let createdUser = await dataSources.usersApi.createUser(args.name, args.email);

        let token = await dataSources.authApi.createToken(createdUser.id);

        return token;
      }
    }
  };