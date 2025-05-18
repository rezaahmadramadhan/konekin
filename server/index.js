if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const { userTypeDefs, userResolvers } = require("./schemas/user");
const { verifyToken } = require("./helpers/jwt");
const User = require("./models/User");
const { postTypeDefs, postResolvers } = require("./schemas/post");
const { followTypeDefs, followResolvers } = require("./schemas/follow");

const server = new ApolloServer({
  typeDefs: [userTypeDefs, postTypeDefs, followTypeDefs],
  resolvers: [userResolvers, postResolvers, followResolvers],
  introspection: true,
});

startStandaloneServer(server, {
  listen: { port: process.env.PORT || 3000 },
  context: async ({ req }) => {
    return {
      auth: async () => {
        const authorization = req.headers.authorization;
        if (!authorization) throw new Error("Please login first");

        const [type, access_token] = authorization.split(" ");
        if (type !== "Bearer") throw new Error("Invalid token");

        const valid = verifyToken(access_token);
        if (!valid) throw new Error("Invalid token");

        const user = await User.findById(valid.id);
        if (!user) throw new Error("User not found");

        return user;
      },
    };
  },
}).then(({ url }) => {
  console.log(`Server ready at: ${url}`);
});
