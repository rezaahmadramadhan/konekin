const { database } = require("../config/mongodb");

class User {
  static collection() {
    return database.collection("users");
  }

  static async create(newUser) {
    // newUser.
    newUser.createdAt = new Date();
    newUser.updatedAt = new Date();
    return await this.collection().insertOne(newUser);
  }

  static async findByName(name) {
    const users = await this.collection()
      .find({
        name: {
          $regex: name,
          $options: "i",
        },
      })
      .toArray();

    return users;
  }
}

module.exports = User;
