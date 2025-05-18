const User = require("../models/User");

const userTypeDefs = `#graphql
    type User {
      _id: ID
      name: String
      username: String!
      email: String!
      password: String!
      followDetail: [FollowDetail]
      userFollowers: [UserFollower]
      userFollowings: [UserFollowing]
    }

    type FollowDetail {
      _id: ID
      followerId: ID
      followingId: ID
    }

    type UserFollower {
      _id: ID
      name: String
      username: String
      email: String
    }

    type UserFollowing {
      _id: ID
      name: String
      username: String
      email: String
    }

    type LoginResponse {
      access_token: String
    }

    type Query {
      findUser(name: String, username: String): [User]
      findUserById(id: ID): User
    }

    type Mutation {
      register(name: String, username: String, email: String, password: String): String
      login(username: String, password: String): LoginResponse
    }
`;

const userResolvers = {
  Query: {
    findUser: async (_, { name, username }) => {
      try {
        let user;

        if (!name && !username) {
          // Return all users if no search parameters are provided
          user = await User.find();
        } else if (name && username) {
          // If both are provided, we'll search for either
          const nameResults = await User.findByName(name);
          const usernameResults = await User.findByName(username);
          
          // Combine and remove duplicates
          const combinedResults = [...nameResults, ...usernameResults];
          const uniqueIds = {};
          
          user = combinedResults.filter(u => {
            if (uniqueIds[u._id]) return false;
            uniqueIds[u._id] = true;
            return true;
          });
        } else if (name) {
          user = await User.findByName(name);
        } else if (username) {
          user = await User.findByName(username);
        }

        return user;
      } catch (error) {
        console.error("Error in findUser resolver:", error);
        return [];
      }
    },

    findUserById: async (_, { id }) => {
      const user = await User.findById(id);
      console.log(user, "ini user");

      return user;
    },
  },

  Mutation: {
    register: async (_, { name, username, email, password }) => {
      await User.create({ name, username, email, password });
      return "Register Success";
    },

    login: async (_, { username, password }) => {
      const access_token = await User.login({ username, password });
      return { access_token };
    },
  },
};

module.exports = { userTypeDefs, userResolvers };
