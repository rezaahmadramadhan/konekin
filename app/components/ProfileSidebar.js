import React, { useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  ActivityIndicator,
  Image,
} from "react-native";
import { AuthContext } from "../contexts/Auth";
import { useNavigation } from "@react-navigation/native";
import useProfile from "../hooks/useProfile";

const { width } = Dimensions.get("window");

export default function ProfileSidebar({ isVisible, onClose }) {
  const { logout } = useContext(AuthContext);
  const navigation = useNavigation();
  const { loading, error, user } = useProfile();
  const slideAnim = React.useRef(new Animated.Value(-width)).current;

  React.useEffect(() => {
    if (isVisible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -width,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible, slideAnim]);

  const handleLogout = async () => {
    try {
      await logout();
      onClose();
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const handleViewProfile = () => {
    navigation.navigate("Profile");
    onClose();
  };

  if (!isVisible) return null;
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      />
      <Animated.View
        style={[styles.sidebar, { transform: [{ translateX: slideAnim }] }]}
      >
        <View style={styles.profileSection}>
          {loading ? (
            <View>
              <ActivityIndicator size="small" color="#0077b5" />
              <View style={styles.profileImage} />
            </View>
          ) : error ? (
            <View>
              <Text style={styles.errorText}>Error loading profile</Text>
              <Text style={styles.errorDetails}>{error.message}</Text>
              <View style={styles.profileImage} />
            </View>
          ) : (
            <>
              <Image
                source={{
                  uri:
                    "https://ui-avatars.com/api/?name=" +
                    encodeURIComponent(user?.name || "User Profile") +
                    "&background=0D8ABC&color=fff",
                }}
                style={styles.profileImage}
              />
              <Text style={styles.profileName}>
                {user?.name || "User Profile"}
              </Text>
              <Text style={styles.profileUsername}>
                @{user?.username || "username"}
              </Text>
              {user?.email && (
                <Text style={styles.profileEmail}>{user.email}</Text>
              )}
            </>
          )}
        </View>

        <View style={styles.menuSection}>
          <TouchableOpacity style={styles.menuItem} onPress={handleViewProfile}>
            <Text style={styles.menuItemText}>View Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuItemText}>Edit Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuItemText}>Settings</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  sidebar: {
    position: "absolute",
    top: 0,
    left: 0,
    width: width * 0.7,
    height: "100%",
    backgroundColor: "white",
    paddingTop: 50,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 20,
  },
  profileSection: {
    alignItems: "center",
    marginBottom: 30,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#ddd",
    marginBottom: 15,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  profileUsername: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  profileEmail: {
    fontSize: 12,
    color: "#888",
  },
  errorText: {
    color: "#e74c3c",
    fontSize: 14,
    marginTop: 5,
    marginBottom: 3,
  },
  errorDetails: {
    color: "#e74c3c",
    fontSize: 12,
    marginBottom: 5,
  },
  menuSection: {
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 20,
  },
  menuItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  menuItemText: {
    fontSize: 16,
    color: "#333",
  },
  logoutButton: {
    marginTop: 30,
    backgroundColor: "#f0f0f0",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  logoutButtonText: {
    fontSize: 16,
    color: "#e74c3c",
    fontWeight: "bold",
  },
});
