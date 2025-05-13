const { database } = require("../config/mongodb");
const { hashPassword } = require("../helpers/bcrypt");

class User {
  static collection() {
    return database.collection("users");
  }

  static async create(newUser) {
    try {
      const conditions = [];

      if (newUser.username) {
        conditions.push({ username: newUser.username });
      }

      if (newUser.email) {
        conditions.push({ email: newUser.email });
      }

      let existingUser = null;
      if (conditions.length > 0) {
        existingUser = await this.collection().findOne({ $or: conditions });
      }

      if (existingUser) throw new Error("User already exists");

      if (!newUser.email.includes("@")) {
        throw new Error("Email must be valid");
      }

      if (newUser.password.length < 5) {
        throw new Error("Password must be at least 5 characters");
      }

      newUser.password = hashPassword(newUser.password);
      return await this.collection().insertOne(newUser);
    } catch (error) {
      throw error;
    }
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
