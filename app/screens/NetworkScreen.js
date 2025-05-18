import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { useQuery, useMutation, gql } from "@apollo/client";
import { SafeAreaView } from "react-native-safe-area-context";
import useProfile from "../hooks/useProfile";

const FIND_USERS = gql`
  query FindUsers($name: String, $username: String) {
    findUser(name: $name, username: $username) {
      _id
      name
      username
      email
    }
  }
`;

const FOLLOW_USER = gql`
  mutation FollowUser($followingId: ID) {
    followUser(followingId: $followingId)
  }
`;

export default function NetworkScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchParam, setSearchParam] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [connectionStates, setConnectionStates] = useState({});
  const { userId, user } = useProfile();

  // Get full user profile with followers and followings
  const GET_USER_DETAILS = gql`
    query Query($id: ID) {
      findUserById(id: $id) {
        _id
        userFollowings {
          _id
        }
      }
    }
  `;

  // Query to get the full user profile including followings
  const { data: userDetailsData } = useQuery(GET_USER_DETAILS, {
    variables: { id: userId },
    skip: !userId,
    onCompleted: (data) => {
      if (data?.findUserById?.userFollowings) {
        // Initialize connection states based on user's following list
        const initialStates = {};
        data.findUserById.userFollowings.forEach((following) => {
          initialStates[following._id] = "following";
        });
        setConnectionStates(initialStates);
      }
    },
  });

  const { loading, error, data, refetch } = useQuery(FIND_USERS, {
    variables: searchParam,
    fetchPolicy: "cache-first",
    onError: (error) => {
      if (error.message.includes("User not found")) {
        return;
      }
    },
  });
  const [followUser, { loading: followLoading }] = useMutation(FOLLOW_USER, {
    onCompleted: (data) => {
      const status = data.followUser;
      if (status === "followed") {
        Alert.alert("Success", "User followed successfully!");
      } else if (status === "unfollowed") {
        Alert.alert("Success", "User unfollowed successfully!");
      }
    },
    onError: (error) => {
      Alert.alert(
        "Error",
        error.message || "Failed to follow user. Please try again."
      );
    },
    refetchQueries: [
      {
        query: gql`
          query Query($id: ID) {
            findUserById(id: $id) {
              _id
              userFollowers {
                _id
              }
              userFollowings {
                _id
              }
            }
          }
        `,
        variables: { id: userId },
      },
    ],
  });

  const refreshContent = React.useCallback(() => {
    setIsRefreshing(true);
    refetch(searchParam).finally(() => {
      setIsRefreshing(false);
    });
  }, [refetch, searchParam]);

  const fixedHeader = React.useMemo(
    () => (
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Network</Text>
      </View>
    ),
    []
  );

  const searchBar = React.useMemo(
    () => (
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name or username..."
            placeholderTextColor="#666"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => setSearchQuery("")}
            >
              <Text style={styles.clearButtonText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    ),
    [searchQuery, setSearchQuery]
  );
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim()) {
        setSearchParam({
          name: searchQuery,
          username: searchQuery,
        });
      } else {
        setSearchParam(null);
        refetch({ name: null, username: null });
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);
  const handleConnectPress = (userId) => {
    if (followLoading) return;

    // Update UI optimistically
    setConnectionStates((prev) => ({
      ...prev,
      [userId]: prev[userId] === "following" ? "connect" : "following",
    }));

    // Call the followUser mutation
    followUser({
      variables: {
        followingId: userId,
      },
      update: (cache, { data }) => {
        // Update the cache to reflect the follow/unfollow action
        const status = data.followUser;

        // If we have the user details cached, update them
        const cachedData = cache.readQuery({
          query: GET_USER_DETAILS,
          variables: { id: userId },
        });

        if (cachedData) {
          // Update the cache with optimistic response
          if (status === "followed" || status === "unfollowed") {
            // Refresh the user profile data
            refetch();
          }
        }
      },
    });
  };
  const renderUserItem = ({ item }) => {
    // Skip rendering if it's the current user
    if (item._id === userId) {
      return null;
    }

    const connectionState = connectionStates[item._id] || "connect";
    const isFollowing = connectionState === "following";

    return (
      <TouchableOpacity style={styles.userCard}>
        <View style={styles.userInfo}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>
              {item.name
                ? item.name.charAt(0).toUpperCase()
                : item.username.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={styles.userDetails}>
            <Text style={styles.userName}>{item.name || "No name"}</Text>
            <Text style={styles.userUsername}>@{item.username}</Text>
            <Text style={styles.userEmail}>{item.email}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={[
            styles.connectButton,
            isFollowing ? styles.followingButton : {},
          ]}
          onPress={() => handleConnectPress(item._id)}
        >
          <Text
            style={[
              styles.connectButtonText,
              isFollowing ? styles.followingButtonText : {},
            ]}
          >
            {isFollowing ? "Following" : "Connect"}
          </Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };
  if (loading && !searchQuery && !data) {
    return (
      <SafeAreaView style={styles.container}>
        {fixedHeader}
        {searchBar}
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#0077b5" />
        </View>
      </SafeAreaView>
    );
  }

  if (error && !searchQuery) {
    return (
      <SafeAreaView style={styles.container}>
        {fixedHeader}
        {searchBar}
        <View style={styles.centered}>
          <Text style={styles.errorText}>Error: {error.message}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => refreshContent()}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {fixedHeader}
      {searchBar}

      <View style={styles.contentContainer}>
        {loading && searchQuery.length > 0 ? (
          <View style={styles.centered}>
            <ActivityIndicator size="small" color="#0077b5" />
            <Text style={styles.loadingText}>Searching users...</Text>
          </View>
        ) : (
          <FlatList
            data={data?.findUser || []}
            renderItem={renderUserItem}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.listContainer}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  {searchQuery
                    ? "No users found matching your search"
                    : "No users found"}
                </Text>
              </View>
            }
            refreshing={isRefreshing}
            onRefresh={refreshContent}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f2f5",
  },
  header: {
    backgroundColor: "#ffffff",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0077b5",
  },
  contentContainer: {
    flex: 1,
  },
  listContainer: {
    padding: 10,
    paddingBottom: 80,
  },
  userCard: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#0077b5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  avatarText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  userUsername: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  userEmail: {
    fontSize: 12,
    color: "#999",
    marginTop: 2,
  },
  connectButton: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#0077b5",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  connectButtonText: {
    color: "#0077b5",
    fontWeight: "bold",
    fontSize: 14,
  },
  followingButton: {
    backgroundColor: "#0077b5",
    borderColor: "#0077b5",
  },
  followingButtonText: {
    color: "#ffffff",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f2f5",
  },
  errorText: {
    color: "#ff3b30",
    fontSize: 16,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#0077b5",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  retryButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
  emptyContainer: {
    padding: 20,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
  },
  searchContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 20,
    paddingHorizontal: 15,
    backgroundColor: "#f8f8f8",
    height: 40,
  },
  searchIcon: {
    fontSize: 14,
    marginRight: 6,
    color: "#666",
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: "#333",
    fontSize: 14,
  },
  clearButton: {
    height: 18,
    width: 18,
    borderRadius: 9,
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },
  clearButtonText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  loadingText: {
    marginTop: 10,
    color: "#666",
    fontSize: 14,
  },
});
