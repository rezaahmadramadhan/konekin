const Post = require("../models/Post");

const postTypeDefs = `#graphql
    type Post {
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
      createPost(content: String, tags: [String], imgUrl: String): Post
    }
`;

const postResolvers = {
  Query: {},
  Mutation: {},
};

module.exports = { postTypeDefs, postResolvers };
