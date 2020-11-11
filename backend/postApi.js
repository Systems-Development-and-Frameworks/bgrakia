const { RESTDataSource } = require('apollo-datasource-rest');

class PostsAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = 'localhost:4000';
  }

  async getPost(title) {
    return this.get(`posts/${title}`);
  }

  async getPosts() {
    return this.get(`posts`);
  }

  async getMostVotedPosts(limit = 10) {
    const data = await this.get('posts', {
      per_page: limit,
      order_by: 'votes',
    });
    return data.results;
  }
}
