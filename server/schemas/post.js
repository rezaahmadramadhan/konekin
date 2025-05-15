const { ObjectId } = require("mongodb");
const Post = require("../models/Post");
const redis = require("../config/redis");

const postTypeDefs = `#graphql
    type Post {
      _id: ID
      content: String!
      tags: [String]
      imgUrl: String
      authorId: ID
      author: Author
      likes: [Like]
      comments: [Comment]
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
      likePost(postId: ID): String
      commentPost(postId: ID, content: String): [Comment]
    }
`;

const postResolvers = {
  Query: {
    getPosts: async (_, __, { auth }) => {
      await auth();
      const posts = await Post.getAll();

      const postRedis = JSON.parse(await redis.get("posts"));
      if (postRedis) {
        return postRedis;
      }
      await redis.set("posts", JSON.stringify(posts));

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

      redis.del("posts");

      return "Post created successfully";
    },
    likePost: async (_, { postId }, { auth }) => {
      const user = await auth();
      const post = await Post.collection().findOne({
        _id: new ObjectId(postId),
      });
      if (!post) throw new Error("Post not found");

      const status = await Post.likePost(postId, user.username);

      redis.del("posts");

      return status;
    },
    commentPost: async (_, { postId, content }, { auth }) => {
      const user = await auth();
      const post = await Post.collection().findOne({
        _id: new ObjectId(postId),
      });
      if (!post) throw new Error("Post not found");

      const comments = await Post.commentPost(postId, content, user.username);

      redis.del("posts");

      return comments;
    },
  },
};

module.exports = { postTypeDefs, postResolvers };
