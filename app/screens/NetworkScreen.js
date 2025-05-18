import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useQuery, gql } from "@apollo/client";
import { SafeAreaView } from "react-native-safe-area-context";

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

export default function NetworkScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchParam, setSearchParam] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Use fetchPolicy 'cache-first' to prevent unnecessary refreshes
  const { loading, error, data, refetch } = useQuery(FIND_USERS, {
    variables: searchParam,
    fetchPolicy: "cache-first",
    onError: (error) => {
      // Silently handle "User not found" errors for better UX
      if (error.message.includes("User not found")) {
        return;
      }
    }
  });

  // Function to refresh only the content, not header or search
  const refreshContent = React.useCallback(() => {
    setIsRefreshing(true);
    refetch(searchParam).finally(() => {
      setIsRefreshing(false);
    });
  }, [refetch, searchParam]);

  // Memo-ize the fixed parts of the UI to prevent refresh
  const fixedHeader = React.useMemo(() => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>My Network</Text>
    </View>
  ), []);

  const searchBar = React.useMemo(() => (
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
            onPress={() => setSearchQuery('')}
          >
            <Text style={styles.clearButtonText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  ), [searchQuery, setSearchQuery]);

  // Debounced search handling
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim()) {
        setSearchParam({ 
          name: searchQuery,
          username: searchQuery
        });
      } else {
        setSearchParam(null);
        // When clearing search, refetch with null params but don't cause a refresh
        refetch({ name: null, username: null });
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const renderUserItem = ({ item }) => (
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
      <TouchableOpacity style={styles.connectButton}>
        <Text style={styles.connectButtonText}>Connect</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );  if (loading && !searchQuery && !data) {
    return (
      <SafeAreaView style={styles.container}>
        {/* Keep the fixed header and search even in loading state */}
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
        {/* Keep the fixed header and search even in error state */}
        {fixedHeader}
        {searchBar}
        <View style={styles.centered}>
          <Text style={styles.errorText}>Error: {error.message}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => refreshContent()}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Fixed header that doesn't refresh */}
      {fixedHeader}

      {/* Fixed search container that doesn't refresh */}
      {searchBar}

      {/* Content area that can refresh independently */}
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
                  {searchQuery ? "No users found matching your search" : "No users found"}
                </Text>
              </View>
            }
            // Allow refreshing only the content area
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
