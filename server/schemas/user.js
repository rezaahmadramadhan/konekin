const User = require("../models/User");

const userTypeDefs = `#graphql
    type User {
        name: String
        username: String!
        email: String!
        password: String!
    }

    type Query {
        users: [User]
        usersByName(name: String): [User]
    }

    type Mutation {
        register(name: String, username: String, email: String, password: String): String
        login(username: String, password: String): String
    }
`;

const userResolvers = {
  Query: {
    users: async () => {
      const users = await User.find();
      return users;
    },
  },

  Mutation: {
    register: async (_, { username, email, password }) => {
      await User.create({ username, email, password });
      return "Register Success";
    },

    login: async (_, { username, password }) => {
      const result = await User.login({ username, password });
      return result.access_token;
    },
  },
};

module.exports = { userTypeDefs, userResolvers };
