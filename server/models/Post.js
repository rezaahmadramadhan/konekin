const { ObjectId } = require("mongodb");
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

  static async getAll() {
    const agg = [
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "authorId",
          foreignField: "_id",
          as: "author",
        },
      },
      {
        $unwind: {
          path: "$author",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          "author.password": 0,
        },
      },
    ];

    const result = await this.collection().aggregate(agg).toArray();

    return result;
  }

  static async getById(id) {
    const agg = [
      {
        $match: {
          _id: new ObjectId(String(id)),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "authorId",
          foreignField: "_id",
          as: "author",
        },
      },
      {
        $unwind: {
          path: "$author",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          "author.password": 0,
        },
      }
    ];

    const post = (await this.collection().aggregate(agg).toArray())[0];
    
    if (!post) throw new Error("Data not found");

    return post;
  }
}

module.exports = Post;
