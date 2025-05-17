import { gql } from "@apollo/client";

export const LIKE_POST = gql`
  mutation LikePost($postId: ID) {
    likePost(postId: $postId)
  }
`;

export const COMMENT_POST = gql`
  mutation CommentPost($postId: ID, $content: String) {
    commentPost(postId: $postId, content: $content) {
      content
      username
      createdAt
      updatedAt
    }
  }
`;
