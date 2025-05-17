import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import PostHeader from './PostHeader';
import PostActions from './PostActions';

export default function KonekInPost({ post }) {
  const navigation = useNavigation();
  if (!post) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Invalid post data</Text>
      </View>
    );
  }

  const handlePostPress = () => {
    navigation.navigate('Detail', { post });
  };
  const handleLike = () => {
    navigation.navigate('Detail', { post, isLiking: true });
  };

  const handleComment = () => {
    navigation.navigate('Detail', { post, openComments: true });
  };

  const handleShare = () => {
    console.log('Share post:', post._id);
  };

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={handlePostPress}
      activeOpacity={0.9}
    >
      <PostHeader 
        author={post.author} 
        timeAgo={"1d ago"} 
      />
      
      <View style={styles.contentContainer}>
        <Text style={styles.content}>{post.content}</Text>
        
        {post.tags && post.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {post.tags.map((tag, index) => (
              <Text key={index} style={styles.tag}>#{tag}</Text>
            ))}
          </View>
        )}
        
        {post.imgUrl && (
          <Image
            source={{ uri: post.imgUrl }}
            style={styles.image}
            resizeMode="cover"
          />
        )}
      </View>
      {(post.likes?.length > 0 || post.comments?.length > 0) && (
        <View style={styles.statsContainer}>
          {post.likes?.length > 0 && (
            <View style={styles.statItem}>
              <Text style={styles.actionIcon}>{"👍"}</Text>
              <Text style={styles.statText}>{post.likes.length}</Text>
            </View>
          )}
          
          {post.comments?.length > 0 && (
            <TouchableOpacity 
              style={styles.commentsCount}
              onPress={handleComment}
            >
              <Text style={styles.statText}>
                {post.comments.length} comments
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
      
      <PostActions 
        likes={post.likes}
        comments={post.comments}
        onLike={handleLike}
        onComment={handleComment}
        onShare={handleShare}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginHorizontal: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
    overflow: 'hidden',
  },  errorContainer: {
    padding: 16,
    backgroundColor: '#ffeeee',
    borderRadius: 8,
    marginHorizontal: 10,
    marginBottom: 10,
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 14,
  },
  contentContainer: {
    paddingHorizontal: 15,
  },
  content: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 10,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  tag: {
    color: '#0077b5',
    marginRight: 5,
    fontSize: 14,
  },
  image: {
    width: '100%',
    height: 250,
    marginTop: 5,
    borderRadius: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIcon: {
    fontSize: 14,
    marginRight: 5,
  },
  statText: {
    color: '#666',
    fontSize: 13,
  },
  commentsCount: {
    paddingVertical: 2,
  },
});
