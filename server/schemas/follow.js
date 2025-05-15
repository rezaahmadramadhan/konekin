const { ObjectId } = require("mongodb");
const Follow = require("../models/Follow");
const User = require("../models/User");

const followTypeDefs = `#graphql
    type Follow {
        _id: ID
        followingId: ID
        followerId: ID
        createdAt: String
        updatedAt: String
    }

    type Mutation {
        followUser(followingId: ID): String
    }
`;

const followResolvers = {
  Mutation: {
    followUser: async (_, { followingId }, { auth }) => {
      if (!followingId) throw new Error("Following ID required");
      const user = await auth();

      const otherUser = await User.collection().findOne({
        _id: new ObjectId(followingId),
      });
      if (!otherUser) throw new Error("User account not found");

      const status = await Follow.create(followingId, followerId = user._id.toString());
      return status;
    },
  },
};

module.exports = { followTypeDefs, followResolvers };
