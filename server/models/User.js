const { database } = require("../config/mongodb");
const { hashPassword, comparePassword } = require("../helpers/bcrypt");
const { signToken } = require("../helpers/jwt");

class User {
  static collection() {
    return database.collection("users");
  }

  static async create({ username, email, password }) {
    if (!username) throw new Error("Username is required");
    if (!email) throw new Error("Email is required");
    if (!password) throw new Error("Password is required");

    const user = await this.collection().findOne({
      $or: [{ username }, { email }],
    });

    if (user) throw new Error("User already exists");

    if (!email.includes("@")) {
      throw new Error("Email must be valid");
    }

    if (password.length < 5) {
      throw new Error("Password must be at least 5 characters");
    }

    password = hashPassword(password);
    return await this.collection().insertOne({ username, email, password });
  }

  static async login({ username, password }) {
    if (!username) throw new Error("Username is required");
    if (!password) throw new Error("Password is required");

    const user = await this.collection().findOne({ username });
    if (!user) throw new Error("User not found");

    const isValid = comparePassword(password, user.password);
    if (!isValid) throw new Error("Invalid password");

    const access_token = signToken({ id: user._id });

    return { access_token };
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
