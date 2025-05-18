import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  RefreshControl,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { gql, useQuery } from "@apollo/client";
import { useState, useCallback, useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
import KonekInPost from "../components/KonekInPost";
import SearchBar from "../components/SearchBar";

const GET_POSTS = gql`
  query Query {
    getPosts {
      _id
      content
      tags
      imgUrl
      authorId
      comments {
        username
        content
        createdAt
        updatedAt
      }
      likes {
        username
        createdAt
        updatedAt
      }
      author {
        name
      }
    }
  }
`;

export default function HomeScreen({ navigation }) {
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [isSearchEmpty, setIsSearchEmpty] = useState(false);
  const { loading, error, data, refetch } = useQuery(GET_POSTS, {
    fetchPolicy: "cache-and-network", // This will ensure we get fresh data each time
    onError: (error) => {
      console.error("Apollo error details:", error);
      console.error("Network error:", error.networkError);
      if (error.networkError && error.networkError.result) {
        console.error("Network error details:", error.networkError.result);
      }
      console.error("GraphQL errors:", error.graphQLErrors);
    },
  });
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refetch().then(() => setRefreshing(false));
  }, [refetch]);
  useFocusEffect(
    useCallback(() => {
      console.log("Home screen focused - refreshing data");
      const refreshTimeout = setTimeout(() => {
        refetch().catch((err) => {
          console.error("Error during refetch:", err);
        });
      }, 100);

      return () => {
        console.log("Home screen unfocused");
        clearTimeout(refreshTimeout);
      };
    }, [refetch])
  );
  // const handleCreatePost = () => {
  //   console.log("Navigate to create post screen");
  //   navigation.navigate("CreatePost");
  // };
  useEffect(() => {
    if (data && data.getPosts) {
      if (!searchQuery.trim()) {
        setFilteredPosts(data.getPosts);
        setIsSearchEmpty(false);
      } else {
        const query = searchQuery.toLowerCase();
        const filtered = data.getPosts.filter((post) => {
          if (post.content && post.content.toLowerCase().includes(query)) {
            return true;
          }

          if (
            post.tags &&
            post.tags.some((tag) => tag.toLowerCase().includes(query))
          ) {
            return true;
          }

          if (
            post.author &&
            post.author.name &&
            post.author.name.toLowerCase().includes(query)
          ) {
            return true;
          }

          return false;
        });

        setFilteredPosts(filtered);
        setIsSearchEmpty(filtered.length === 0);
      }
    }
  }, [searchQuery, data]);

  const handleSearch = (text) => {
    setSearchQuery(text);
  };

  if (loading && !refreshing)
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor="#f5f5f5" barStyle="dark-content" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0077b5" />
          <Text style={styles.loadingText}>Loading posts...</Text>
        </View>
      </SafeAreaView>
    );

  if (error) {
    console.error("Error fetching posts:", error);
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor="#f5f5f5" barStyle="dark-content" />
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Error loading posts</Text>
          <Text style={styles.errorMessage}>{error.message}</Text>
          {error.networkError && (
            <Text style={styles.errorDetails}>
              Network error: Check your internet connection
            </Text>
          )}
          {error.graphQLErrors &&
            error.graphQLErrors.map((gqlError, index) => (
              <Text key={index} style={styles.errorDetails}>
                {gqlError.message}
              </Text>
            ))}
        </View>
      </SafeAreaView>
    );
  }

  if (!data || !data.getPosts || data.getPosts.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor="#f5f5f5" barStyle="dark-content" />
        <SearchBar onSearch={handleSearch} />
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No posts yet</Text>
          <Text style={styles.emptyMessage}>
            Be the first to share something with your network!
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#f5f5f5" barStyle="dark-content" />
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#0077b5"]}
          />
        }
      >
        <SearchBar onSearch={handleSearch} />
        <View style={styles.feedContainer}>
          {searchQuery.trim() !== "" && isSearchEmpty ? (
            <View style={styles.emptySearchContainer}>
              <Text style={styles.emptySearchTitle}>No results found</Text>
              <Text style={styles.emptySearchMessage}>
                Try different keywords or check your spelling
              </Text>
            </View>
          ) : (
            <>
              {searchQuery.trim() !== "" && (
                <View style={styles.searchResultInfo}>
                  <Text style={styles.searchResultText}>
                    Showing results for: "{searchQuery}"
                  </Text>
                </View>
              )}
              {filteredPosts.map((post, index) => (
                <KonekInPost key={post._id || index} post={post} />
              ))}
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollView: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  feedContainer: {
    paddingBottom: 80,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#555",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#e74c3c",
  },
  errorMessage: {
    fontSize: 15,
    textAlign: "center",
    marginBottom: 10,
    color: "#555",
  },
  errorDetails: {
    fontSize: 14,
    textAlign: "center",
    color: "#777",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  emptyMessage: {
    fontSize: 15,
    textAlign: "center",
    color: "#555",
  },
  emptySearchContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
    marginTop: 50,
  },
  emptySearchTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#555",
  },
  emptySearchMessage: {
    fontSize: 15,
    textAlign: "center",
    color: "#777",
  },
  searchGuideContainer: {
    padding: 20,
    marginTop: 10,
    backgroundColor: "#f0f8ff",
    borderRadius: 8,
    marginHorizontal: 10,
  },
  searchGuideText: {
    fontSize: 15,
    textAlign: "center",
    color: "#0077b5",
    lineHeight: 22,
  },
  searchResultInfo: {
    backgroundColor: "#e6f2ff",
    padding: 10,
    marginHorizontal: 10,
    marginBottom: 10,
    borderRadius: 8,
  },
  searchResultText: {
    fontSize: 14,
    color: "#0077b5",
  },
});
