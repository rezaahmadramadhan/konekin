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
      const users = await User.create();
    },
  },
  Mutation: {
    register: async (_, { username, email, password }) => {
      let newUser = { username, email, password };
      await User.create(newUser);

      return "Register Success";
    },
  },
};

module.exports = { userTypeDefs, userResolvers };
