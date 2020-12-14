const { RESTDataSource } = require('apollo-datasource-rest');

class PostsAPI extends RESTDataSource {

  constructor() {
    super();
    this.posts = [];
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
