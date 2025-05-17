import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  Alert,
} from "react-native";
import { useMutation, gql } from "@apollo/client";
import PostHeader from "../components/PostHeader";
import PostActions from "../components/PostActions";
import useProfile from "../hooks/useProfile";

const formatCommentDate = (dateString) => {
  if (!dateString) return "Just now";

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Just now";
    }
    return date.toLocaleDateString();
  } catch (error) {
    return "Just now";
  }
};

const COMMENT_POST = gql`
  mutation CommentPost($postId: ID, $content: String) {
    commentPost(postId: $postId, content: $content) {
      content
      username
      createdAt
      updatedAt
    }
  }
`;

const LIKE_POST = gql`
  mutation LikePost($postId: ID) {
    likePost(postId: $postId)
  }
`;

export default function DetailScreen({ route, navigation }) {
  const { post, openComments, isLiking } = route.params || {};
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState(post?.comments || []);
  const [postData, setPostData] = useState(post || {});
  const commentInputRef = useRef(null);
  const { user } = useProfile();
  const [commentPost, { loading: commentLoading }] = useMutation(COMMENT_POST, {
    onCompleted: (data) => {
      setComments(data.commentPost);
      setComment("");
    },
    onError: (error) => {
      Alert.alert(
        "Error",
        error.message || "Failed to add comment. Please try again."
      );
    },
  });
  const [likePost, { loading: likeLoading }] = useMutation(LIKE_POST, {
    onCompleted: (data) => {
      const status = data.likePost;
      const currentLikes = [...(postData.likes || [])];

      const currentUsername = user?.username || "currentUser";

      if (status === "liked") {
        if (!currentLikes.some((like) => like.username === currentUsername)) {
          setPostData({
            ...postData,
            likes: [
              ...currentLikes,
              {
                username: currentUsername,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              },
            ],
          });
        }
      } else if (status === "unliked") {
        setPostData({
          ...postData,
          likes: currentLikes.filter(
            (like) => like.username !== currentUsername
          ),
        });
      }
    },
    onError: (error) => {
      Alert.alert(
        "Error",
        error.message || "Failed to like post. Please try again."
      );
    },
    onCompleted: () => {
      if (isLiking) {
        navigation.goBack();
      }
    },
  });
  React.useEffect(() => {
    if (openComments && commentInputRef.current) {
      setTimeout(() => {
        commentInputRef.current.focus();
      }, 500);
    }

    if (isLiking) {
      handleLikePost();
    }
  }, [openComments, isLiking]);

  if (!postData) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Post not found</Text>
      </View>
    );
  }

  const handleSendComment = () => {
    if (!comment.trim()) return;

    commentPost({
      variables: {
        postId: postData._id,
        content: comment,
      },
    });

    setComment("");
  };
  const handleLikePost = () => {
    if (likeLoading) return;

    likePost({
      variables: {
        postId: postData._id,
      },
    });
  };
  const renderComment = ({ item, index }) => (
    <View style={styles.commentItem} key={item.id || `comment-${index}`}>
      <View style={styles.commentAuthorImage} />
      <View style={styles.commentContent}>
        <Text style={styles.commentAuthor}>{item.username || "Anonymous"}</Text>
        <Text style={styles.commentText}>{item.content}</Text>
        <Text style={styles.commentTime}>
          {formatCommentDate(item.createdAt)}
        </Text>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : null}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <View style={styles.container}>
        <ScrollView style={styles.scrollView}>
          {" "}
          <View style={styles.postContainer}>
            <PostHeader author={postData.author} timeAgo="1d ago" />

            <View style={styles.contentContainer}>
              <Text style={styles.content}>{postData.content}</Text>
              {postData.tags && postData.tags.length > 0 && (
                <View style={styles.tagsContainer}>
                  {postData.tags.map((tag, index) => (
                    <Text key={index} style={styles.tag}>
                      #{tag}
                    </Text>
                  ))}
                </View>
              )}
              {postData.imgUrl && (
                <Image
                  source={{ uri: postData.imgUrl }}
                  style={styles.image}
                  resizeMode="cover"
                />
              )}{" "}
            </View>

            {(postData.likes?.length > 0 || comments.length > 0) && (
              <View style={styles.statsContainer}>
                {" "}
                {postData.likes?.length > 0 && (
                  <Text style={styles.statText}>
                    👍 {postData.likes.length}
                  </Text>
                )}
                {comments.length > 0 && (
                  <Text style={styles.statText}>
                    {comments.length} comments
                  </Text>
                )}
              </View>
            )}

            <PostActions
              likes={postData.likes}
              comments={comments}
              onLike={handleLikePost}
              onComment={() => commentInputRef.current?.focus()}
              onShare={() => console.log("Share")}
            />
          </View>
          <View style={styles.commentsSection}>
            <Text style={styles.commentsHeader}>Comments</Text>
            {comments.length === 0 ? (
              <Text style={styles.noCommentsText}>
                No comments yet. Be the first to comment!
              </Text>
            ) : (
              <FlatList
                data={comments}
                renderItem={renderComment}
                keyExtractor={(item, index) => item.id || `comment-${index}`}
                scrollEnabled={false}
              />
            )}
          </View>
        </ScrollView>
        <View style={styles.commentInputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              ref={commentInputRef}
              style={styles.commentInput}
              placeholder="Add a comment..."
              value={comment}
              onChangeText={setComment}
              multiline
            />
          </View>
          <TouchableOpacity
            style={[
              styles.sendButton,
              (!comment.trim() || commentLoading) && styles.sendButtonDisabled,
            ]}
            onPress={handleSendComment}
            disabled={!comment.trim() || commentLoading}
          >
            <Text style={styles.sendButtonText}>
              {commentLoading ? "Sending..." : "Send"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollView: {
    flex: 1,
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
  postContainer: {
    backgroundColor: "white",
    padding: 15,
    marginBottom: 10,
  },
  contentContainer: {
    marginVertical: 10,
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
  },
  tag: {
    color: "#0077b5",
    marginRight: 8,
    fontSize: 14,
  },
  image: {
    width: "100%",
    height: 300,
    marginTop: 15,
    borderRadius: 8,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    marginBottom: 5,
  },
  statText: {
    color: "#666",
    fontSize: 14,
  },
  commentsSection: {
    backgroundColor: "white",
    padding: 15,
    paddingBottom: 30,
  },
  commentsHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  noCommentsText: {
    color: "#777",
    textAlign: "center",
    marginTop: 10,
    fontStyle: "italic",
  },
  commentItem: {
    flexDirection: "row",
    marginBottom: 15,
  },
  commentAuthorImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#ddd",
    marginRight: 10,
  },
  commentContent: {
    flex: 1,
    backgroundColor: "#f1f1f1",
    padding: 10,
    borderRadius: 12,
  },
  commentAuthor: {
    fontWeight: "bold",
    marginBottom: 3,
  },
  commentText: {
    fontSize: 14,
    lineHeight: 20,
  },
  commentTime: {
    fontSize: 12,
    color: "#777",
    marginTop: 5,
    alignSelf: "flex-end",
  },
  commentInputContainer: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    alignItems: "center",
  },
  inputWrapper: {
    flex: 1,
    backgroundColor: "#f1f1f1",
    borderRadius: 20,
    marginRight: 10,
    minHeight: 40,
    maxHeight: 100,
    justifyContent: "center",
  },
  commentInput: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    maxHeight: 100,
    fontSize: 15,
  },
  sendButton: {
    backgroundColor: "#0077b5",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  sendButtonDisabled: {
    backgroundColor: "#cccccc",
  },
  sendButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});
