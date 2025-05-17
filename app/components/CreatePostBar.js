import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text, Image } from 'react-native';
import ProfileSidebar from './ProfileSidebar';
import useProfile from '../hooks/useProfile';

export default function CreatePostBar({ onPress }) {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const { user } = useProfile();

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };  return (
    <>
      <TouchableOpacity 
        style={styles.container}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <TouchableOpacity 
          onPress={toggleSidebar}
          activeOpacity={0.7}
        >
          <Image 
            source={{ uri: 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user?.name || 'User') + '&background=0D8ABC&color=fff' }} 
            style={styles.profileImagePlaceholder} 
          />
        </TouchableOpacity>
        <View style={styles.inputContainer}>
          <Text style={styles.placeholderText}>Search</Text>
        </View>
      </TouchableOpacity>

      <ProfileSidebar 
        isVisible={sidebarVisible} 
        onClose={() => setSidebarVisible(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 10,
    marginHorizontal: 10,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },    shadowOpacity: 0.1,
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
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 20,
    paddingHorizontal: 15,
  },
  placeholderText: {
    color: '#666',
  },
});
