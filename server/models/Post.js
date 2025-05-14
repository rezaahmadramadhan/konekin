const { database } = require("../config/mongodb");

class Post {
  static collection() {
    return database.collection("posts");
  }

  static async create(newPost) {
    if (!newPost.content) throw new Error("Content is required");
    if (!newPost.authorId) throw new Error("Author ID is required");

    const post = await this.collection().findOne({ content: newPost.content });
    if (post) throw new Error("Post already exists");

    newPost.createdAt = new Date();
    newPost.updatedAt = new Date();

    return await this.collection().insertOne(newPost);
  }
}

module.exports = Post;
