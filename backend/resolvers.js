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
    Mutation:{
      async write(parent, args, { dataSources }) {
        let {
          title, 
          author: {name}
        } = args.post;
        
        // Check if a post with the title already exists.
        let persistedPost = await dataSources.postsApi.getPost(title);
        if (persistedPost !== undefined) {
          throw new UserInputError("Post with this title already exists.", {invalidArgs: [title]});
        }
  
        // Check if the author exists 
        let author = await dataSources.usersApi.getUser(name);
        if (author === undefined) {
          throw new UserInputError("No such author.", {invalidArgs: [author]});
        }
  
        return await dataSources.postsApi.createPost({title, author: name});
      },
      async upvote(parent, args, { dataSources }) {
        // Why must we mock the current user? We have him right here, in the voter field?
  
        let postToUpvote = await dataSources.postsApi.getPost(args.title);
        if (postToUpvote === undefined) {
          throw new UserInputError("Post with this title doesn't exist", {invalidArgs: [args.title]});
        }
  
        let upvoter = await dataSources.usersApi.getUser(args.voter.name);
        if (upvoter === undefined) {
          throw new UserInputError("No such voter.", {invalidArgs: [args.voter]});
        }
  
        let alreadyVoted = postToUpvote.upvoters.includes(args.voter.name);
        if (alreadyVoted) {
          throw new UserInputError("This voter has already upvoted this article", {invalidArgs: [args.title, args.voter]});
        }
  
        return await dataSources.postsApi.upvotePost(postToUpvote, args.voter.name);
      }
    }
  };