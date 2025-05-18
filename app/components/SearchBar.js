import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
  Image,
} from "react-native";
import ProfileSidebar from "./ProfileSidebar";
import useProfile from "../hooks/useProfile";

export default function SearchBar({ onSearch }) {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const { user } = useProfile();

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const handleTextChange = (text) => {
    setSearchText(text);
    onSearch && onSearch(text);
  };

  const clearSearch = () => {
    setSearchText("");
    onSearch && onSearch("");
  };

  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity onPress={toggleSidebar} activeOpacity={0.7}>
          <Image
            source={{
              uri:
                "https://ui-avatars.com/api/?name=" +
                encodeURIComponent(user?.name || "User") +
                "&background=0D8ABC&color=fff",
            }}
            style={styles.profileImagePlaceholder}
          />
        </TouchableOpacity>
        <View style={styles.inputContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search for posts..."
            placeholderTextColor="#666"
            value={searchText}
            onChangeText={handleTextChange}
          />
          {searchText.length > 0 && (
            <TouchableOpacity style={styles.clearButton} onPress={clearSearch}>
              <Text style={styles.clearButtonText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ProfileSidebar
        isVisible={sidebarVisible}
        onClose={() => setSidebarVisible(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 10,
    marginHorizontal: 10,
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
  },
  profileImagePlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  inputContainer: {
    flex: 1,
    height: 40,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 20,
    paddingHorizontal: 15,
    backgroundColor: "#f8f8f8",
  },
  placeholderText: {
    color: "#666",
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: "#333",
    fontSize: 14,
  },
  searchIcon: {
    fontSize: 14,
    marginRight: 6,
    color: "#666",
  },
  clearButton: {
    position: "absolute",
    right: 10,
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
});
