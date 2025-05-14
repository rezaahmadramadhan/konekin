const { database } = require("../config/mongodb");

class Post {
    static collection() {
        return database.collection("posts");
    }

    static async create({content, tags, imgUrl, authorId, comments, likes}) {
        if (!content) throw new Error("Content is required");
        if (!authorId) throw new Error("Author ID is required");

        return await this.collection().insertOne({ content, tags, imgUrl, authorId, comments, likes });
    }
}

module.exports = Post;