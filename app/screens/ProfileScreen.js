import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, SafeAreaView, Image } from 'react-native';
import { useContext } from 'react';
import { AuthContext } from '../contexts/Auth';
import { useNavigation } from '@react-navigation/native';
import useProfile from '../hooks/useProfile';
import { gql, useQuery } from '@apollo/client';

const GET_USER_DETAILS = gql`
  query Query($id: ID) {
    findUserById(id: $id) {
      _id
      name
      username
      email
      userFollowers {
        _id
        name
        username
      }
      userFollowings {
        _id
        name
        username
      }
    }
  }
`;

export default function ProfileScreen() {
  const { logout } = useContext(AuthContext);
  const navigation = useNavigation();
  const { userId } = useProfile();
  
  const { loading, error, data } = useQuery(GET_USER_DETAILS, {
    variables: { id: userId },
    skip: !userId,
  });
  
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };
  
  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0077b5" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </SafeAreaView>
    );
  }
  
  if (error) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Error loading profile</Text>
        <Text style={styles.errorMessage}>{error.message}</Text>
        {error.graphQLErrors && error.graphQLErrors.map((gqlError, index) => (
          <Text key={index} style={styles.errorMessage}>
            {gqlError.message}
          </Text>
        ))}
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
  
  const user = data?.findUserById || {
    name: 'User Profile',
    username: 'username',
    email: 'user@example.com',
    userFollowers: [],
    userFollowings: []
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <View style={styles.profileImageContainer}>
            <Image 
              source={{ uri: 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.name) + '&background=0D8ABC&color=fff' }} 
              style={styles.profileImage}
            />
          </View>
          
          <View style={styles.profileInfo}>
            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.username}>@{user.username}</Text>
            <Text style={styles.email}>{user.email}</Text>
          </View>
        </View>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{user.userFollowers?.length || 0}</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>
          
          <View style={styles.statDivider} />
          
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{user.userFollowings?.length || 0}</Text>
            <Text style={styles.statLabel}>Following</Text>
          </View>
        </View>
        
        {user.userFollowers?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Followers</Text>
            {user.userFollowers.map((follower) => (
              <View key={follower._id} style={styles.userItem}>
                <View style={styles.userItemImage} />
                <View style={styles.userItemInfo}>
                  <Text style={styles.userItemName}>{follower.name}</Text>
                  <Text style={styles.userItemUsername}>@{follower.username}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
        
        {user.userFollowings?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Following</Text>
            {user.userFollowings.map((following) => (
              <View key={following._id} style={styles.userItem}>
                <View style={styles.userItemImage} />
                <View style={styles.userItemInfo}>
                  <Text style={styles.userItemName}>{following.name}</Text>
                  <Text style={styles.userItemUsername}>@{following.username}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
        
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#e74c3c',
  },
  errorMessage: {
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 20,
    color: '#555',
  },
  header: {
    backgroundColor: 'white',
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  profileImageContainer: {
    marginBottom: 15,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ddd',
  },
  profileInfo: {
    alignItems: 'center',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  username: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  email: {
    fontSize: 14,
    color: '#888',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 15,
    marginTop: 10,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: '#e0e0e0',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 10,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    backgroundColor: 'white',
    marginTop: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: '#e0e0e0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  userItemImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ddd',
    marginRight: 10,
  },
  userItemInfo: {
    flex: 1,
  },
  userItemName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  userItemUsername: {
    fontSize: 14,
    color: '#666',
  },
  logoutButton: {
    margin: 20,
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutButtonText: {
    fontSize: 16,
    color: '#e74c3c',
    fontWeight: 'bold',
  },
});
