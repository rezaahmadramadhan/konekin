const Post = require("../models/Post");

const postTypeDefs = `#graphql
    type Post {
      _id: ID
      content: String!
      tags: [String]
      imgUrl: String
      authorId: ID
      comments: [Comment]
      likes: [Like]
    }

    type Comment {
      content: String
      username: String
      createdAt: String
      updatedAt: String
    }

    type Like {
      username: String
      createdAt: String
      updatedAt: String
    }

    type Query {
      findPostById(id: ID): Post
      findPostsByAuthor(authorId: ID): [Post]
    }

    type Mutation {
      addPost(content: String, tags: [String], imgUrl: String): String
    }
`;

const postResolvers = {
  Query: {},
  Mutation: {
    addPost: async (_, { content, tags, imgUrl }, { auth }) => {
      const user = await auth();
      const newPost = {
        content,
        tags,
        imgUrl,
        authorId: user._id,
      };
      const result = await Post.create(newPost);
      newPost._id = result.insertedId;

      return "Post created successfully";
    },
  },
};

module.exports = { postTypeDefs, postResolvers };
