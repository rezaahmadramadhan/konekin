import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

export default function PostHeader({ author, timeAgo }) {
  return (
    <View style={styles.headerContainer}>
      <Image 
        source={{ uri: 'https://via.placeholder.com/40' }} 
        style={styles.profileImage} 
      />
      <View style={styles.headerInfo}>
        <Text style={styles.authorName}>{author?.name || 'Anonymous'}</Text>
        <Text style={styles.timeAgo}>{timeAgo || 'Just now'}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  headerInfo: {
    flex: 1,
  },
  authorName: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  timeAgo: {
    color: '#666',
    fontSize: 12,
  },
});
