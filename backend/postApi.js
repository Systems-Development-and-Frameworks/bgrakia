const { RESTDataSource } = require('apollo-datasource-rest');

class PostsAPI extends RESTDataSource {
  constructor() {
    super();
    this.posts = [
      {
        title: 'The Thing',
        votes: 0,
        author: 'Peter',
        upvoters:[]
      },
      {
        title: 'The Nothing',
        votes: 0,
        author: 'Peter',
        upvoters:[]
      },
    ];
  }

  async getPost(title) {
    return this.posts.find(post => post.title === title);
  }

  async getPosts() {
    return this.posts;
  }

  async createPost({ title, author }) {
    this.posts.push({ title: title, author: author, votes: 0 });
  }

  async putPost(title, user) {
    let postToUpvote = await this.getPost(title);
    if (postToUpvote.upvoters.includes(user)) return "Already upvoted"
    postToUpvote.votes += 1;
    return "Upvote successful"
  }
}
