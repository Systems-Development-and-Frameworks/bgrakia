class Post {

  constructor(title) {
    this.title = title;
    this.votes = 0;
  }

  static async save(session, post) {
    const { records: postRecords } = await session.writeTransaction((tx) =>
      tx.run("CREATE (p: Post {title: $title, votes: 0}) RETURN p", post)
    )
    return postRecords[0].get('p');
  }
}

module.exports = Post;
