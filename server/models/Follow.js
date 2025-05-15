const { ObjectId } = require("mongodb");
const { database } = require("../config/mongodb");
const User = require("./User");

class Follow {
  static collection() {
    return database.collection("follows");
  }

  static async create(followingId, followerId) {
    if (!followingId) throw new Error("Following ID required");
    if (!followerId) throw new Error("Follower ID required");

    const followed = await this.collection().findOne({
      followerId: new ObjectId(followerId),
      followingId: new ObjectId(followingId),
    });

    if (followed) {
      await this.collection().deleteOne({
        followerId: new ObjectId(followerId),
        followingId: new ObjectId(followingId),
      });

      return "unfollowed";
    } else {
      await this.collection().insertOne({
        followerId: new ObjectId(followerId),
        followingId: new ObjectId(followingId),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      return "followed";
    }
  }
}

module.exports = Follow;
