const { ObjectId } = require("mongodb");
const { database } = require("../config/mongodb");
const { hashPassword, comparePassword } = require("../helpers/bcrypt");
const { signToken } = require("../helpers/jwt");

class User {
  static collection() {
    return database.collection("users");
  }

  static async create({ name, username, email, password }) {
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

    const newUser = await this.collection().insertOne({
      name,
      username,
      email,
      password: hashPassword(password),
    });

    return newUser;
  }

  static async login({ username, password }) {
    if (!username) throw new Error("Username is required");
    if (!password) throw new Error("Password is required");

    const user = await this.collection().findOne({ username });
    if (!user) throw new Error("User not found");

    const isValid = comparePassword(password, user.password);
    if (!isValid) throw new Error("Invalid password");

    const access_token = signToken({ id: user._id });

    return access_token;
  }

  static async find() {
    const users = await this.collection().find().toArray();
    return users;
  }
  static async findByName(search) {
    try {
      const users = await this.collection()
        .find({
          $or: [
            { username: { $regex: search, $options: "i" } },
            { name: { $regex: search, $options: "i" } },
          ],
        })
        .toArray();

      return users;
    } catch (error) {
      throw new Error("Error fetching users: ", error);
    }
  }

  static async findById(id) {
    if (!id) throw new Error("Id is required");

    const agg = [
      {
        $match: {
          _id: new ObjectId(id),
        },
      },
      {
        $lookup: {
          from: "follows",
          localField: "_id",
          foreignField: "followingId",
          as: "followers",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "followers.followerId",
          foreignField: "_id",
          as: "userFollowers",
        },
      },
      {
        $lookup: {
          from: "follows",
          localField: "_id",
          foreignField: "followerId",
          as: "followings",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "followings.followingId",
          foreignField: "_id",
          as: "userFollowings",
        },
      },
    ];

    const user = (await this.collection().aggregate(agg).toArray())[0];
    if (!user) throw new Error("User not found");
    return user;
  }
}

module.exports = User;
