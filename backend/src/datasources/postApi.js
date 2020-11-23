const { DataSource } = require('apollo-datasource-rest');

class PostsAPI extends DataSource {

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
    let obj = { title: title, author: author, votes: 0, upvoters: []};
    this.posts.push(obj);
    return obj;
  }

  async upvotePost(post, upvoter) {
    post.votes += 1;
    post.upvoters.push(upvoter);
    return post;
  }
}

module.exports = PostsAPI;
