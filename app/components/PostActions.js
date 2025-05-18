import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import useProfile from "../hooks/useProfile";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function PostActions({
  likes,
  comments,
  onLike,
  onComment,
  onShare,
}) {
  const { user } = useProfile();
  const currentUsername = user?.username;
  const hasLiked = likes?.some((like) => like.username === currentUsername);

  return (
    <View style={styles.actionsContainer}>
      <TouchableOpacity style={styles.actionButton} onPress={onLike}>
        <Text style={styles.actionIcon}>
          {<EvilIcons name="like" size={24} color="black" />}
        </Text>
        <Text style={[styles.actionText, hasLiked && styles.likedText]}>
          {hasLiked ? "Liked" : "Like"}{" "}
          {likes?.length > 0 ? `(${likes.length})` : ""}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.actionButton} onPress={onComment}>
        <Text style={styles.actionIcon}>
          {<FontAwesome name="commenting-o" size={24} color="black" />}
        </Text>
        <Text style={styles.actionText}>
          Comment {comments?.length > 0 ? `(${comments.length})` : ""}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.actionButton} onPress={onShare}>
        <Text style={styles.actionIcon}>
          {<Ionicons name="paper-plane" size={24} color="black" />}
        </Text>
        <Text style={styles.actionText}>Share</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    paddingVertical: 8,
    marginTop: 10,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  actionIcon: {
    fontSize: 16,
    marginRight: 5,
  },
  actionText: {
    color: "#555",
    fontSize: 13,
  },
  likedText: {
    color: "#0077b5",
    fontWeight: "bold",
  },
});
