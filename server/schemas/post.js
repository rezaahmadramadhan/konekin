const { ObjectId } = require("mongodb");
const Post = require("../models/Post");

const postTypeDefs = `#graphql
    type Post {
      _id: ID
      content: String!
      tags: [String]
      imgUrl: String
      authorId: ID
      author: Author
      comments: [Comment]
      likes: [Like]
    }

    type Author {
        _id: ID
        name: String
        username: String
        email: String
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
      getPosts: [Post]
      getPostById(id: ID): Post
    }

    type Mutation {
      addPost(content: String, tags: [String], imgUrl: String): String
    }
`;

const postResolvers = {
  Query: {
    getPosts: async (_, __, { auth }) => {
      await auth();
      const posts = await Post.getAll();
      return posts;
    },
    getPostById: async (_, { id }, { auth }) => {
      await auth();
      const post = await Post.getById(id);
      
      return post;
    },
  },
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
