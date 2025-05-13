const User = require("../models/User");

const userTypeDefs = `#graphql
    type User {
        name: String
        password: String
    }

    type Query {
        users: [User]
        usersByName(name: String): [User]
    }

    type Mutation {
        register(name: String, password: String): String
        login(name: String, password: String): String
    }
`;

const userResolvers = {
  Query: {
    users: async () => {
      const users = await User.create();
    },
  },
  Mutation: {
    register: async (_, { name, password }) => {
      let newUser = { name, password };
      await User.create(newUser);

      return "Register Success";
    },
  },
};

module.exports = { userTypeDefs, userResolvers };
