import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { gql, useMutation } from "@apollo/client";
import useProfile from "../hooks/useProfile";

const ADD_POST = gql`
  mutation AddPost($content: String, $tags: [String], $imgUrl: String) {
    addPost(content: $content, tags: $tags, imgUrl: $imgUrl)
  }
`;

export default function CreatePostScreen({ navigation }) {
  const [content, setContent] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [imgUrl, setImgUrl] = useState("");

  const { user, loading: profileLoading, error: profileError } = useProfile();
  const [addPost, { loading: postLoading }] = useMutation(ADD_POST, {
    onCompleted: () => {
      Alert.alert("Success", "Post created successfully!");
      navigation.navigate("Home");
    },
    onError: (error) => {
      Alert.alert("Error", error.message || "Failed to create post");
    },
    refetchQueries: ["Query"],
  });

  // Check for profile loading errors
  useEffect(() => {
    if (profileError) {
      console.error("Profile loading error:", profileError);
      Alert.alert(
        "Error",
        "There was a problem loading your profile. Please try again later.",
        [{ text: "Go Back", onPress: () => navigation.goBack() }]
      );
    }
  }, [profileError, navigation]);

  const handleSubmit = () => {
    if (!content.trim()) {
      Alert.alert("Error", "Content cannot be empty");
      return;
    }
    const tags = tagInput.trim()
      ? tagInput.split(/\s+/).filter((tag) => tag.startsWith("#"))
      : [];

    addPost({
      variables: {
        content,
        tags,
        imgUrl: imgUrl.trim(),
      },
    });
  };

  return (
    <ScrollView style={styles.container}>
      {profileLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0077b5" />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      ) : (
        <>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.postButton}
              disabled={postLoading || !content.trim()}
              onPress={handleSubmit}
            >
              {postLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.postButtonText}>Post</Text>
              )}
            </TouchableOpacity>
          </View>
          <View style={styles.profileSection}>
            <Image
              source={{
                uri:
                  "https://ui-avatars.com/api/?name=" +
                  encodeURIComponent(user?.name || "User") +
                  "&background=0D8ABC&color=fff",
              }}
              style={styles.profileImage}
            />
            <Text style={styles.profileName}>{user?.name || "User"}</Text>
          </View>
          <TextInput
            style={styles.contentInput}
            placeholder="What do you want to talk about?"
            placeholderTextColor="#666"
            multiline
            value={content}
            onChangeText={setContent}
          />
          <TextInput
            style={styles.tagInput}
            placeholder="Add hashtags (e.g. #work #technology)"
            placeholderTextColor="#666"
            value={tagInput}
            onChangeText={setTagInput}
          />
          <TextInput
            style={styles.imgUrlInput}
            placeholder="Add image URL"
            placeholderTextColor="#666"
            value={imgUrl}
            onChangeText={setImgUrl}
          />
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    minHeight: 300,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  cancelButton: {
    padding: 8,
  },
  cancelButtonText: {
    color: "#666",
    fontSize: 16,
  },
  postButton: {
    backgroundColor: "#0077b5",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  postButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  profileName: {
    fontSize: 16,
    fontWeight: "600",
  },
  contentInput: {
    padding: 15,
    fontSize: 18,
    minHeight: 150,
  },
  tagInput: {
    padding: 15,
    fontSize: 16,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  imgUrlInput: {
    padding: 15,
    fontSize: 16,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  loadingText: {
    marginTop: 10,
    color: "#666",
    fontSize: 16,
  },
});
