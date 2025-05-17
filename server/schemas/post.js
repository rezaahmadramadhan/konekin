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
  },  Mutation: {
    addPost: async (_, { content, tags, imgUrl }, { auth }) => {
      const user = await auth();
      let processedTags = tags;
      
      if (tags && tags.length > 0) {
        if (tags.length === 1 && typeof tags[0] === 'string') {
          const tagString = tags[0];
          let splitTags = [];
          
          const spaceSplit = tagString.split(/\s+/);
            spaceSplit.forEach(item => {
            if (item.includes('#')) {
              if (item.startsWith('#')) {
                splitTags.push(item.trim());
              } else {
                const parts = item.split('#');
                if (parts[0].trim()) {
                  splitTags.push(parts[0].trim());
                }
                
                for (let i = 1; i < parts.length; i++) {
                  if (parts[i].trim()) {
                    splitTags.push('#' + parts[i].trim());
                  }
                }
              }
            } else if (item.trim()) {
              splitTags.push(item.trim());
            }
          });
          
          processedTags = splitTags;
        }
      }
      
      const newPost = {
        content,
        tags: processedTags,
        imgUrl,
        authorId: user._id,
      };

      console.log("newPost", newPost);
      
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
