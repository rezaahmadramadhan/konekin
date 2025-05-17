import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useMutation } from '@apollo/client';
import { LIKE_POST } from '../mutations/postMutations';
import PostHeader from './PostHeader';
import PostActions from './PostActions';
import useProfile from '../hooks/useProfile';

export default function KonekInPost({ post }) {
  const navigation = useNavigation();
  const { user } = useProfile();
  const [currentPost, setCurrentPost] = useState(post);
  
  // Update local state when props change
  React.useEffect(() => {
    if (post && post._id === currentPost._id && JSON.stringify(post) !== JSON.stringify(currentPost)) {
      setCurrentPost(post);
    }
  }, [post]);
    // Menggunakan useMutation untuk like
  const [likePost, { loading: likeLoading }] = useMutation(LIKE_POST, {
    onCompleted: (data) => {
      const status = data.likePost;
      const currentLikes = [...(currentPost.likes || [])];
      const currentUsername = user?.username || "currentUser";

      if (status === "liked") {
        if (!currentLikes.some((like) => like.username === currentUsername)) {
          setCurrentPost({
            ...currentPost,
            likes: [
              ...currentLikes,
              {
                username: currentUsername,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              },
            ],
          });
        }
      } else if (status === "unliked") {
        setCurrentPost({
          ...currentPost,
          likes: currentLikes.filter(
            (like) => like.username !== currentUsername
          ),
        });
      }
    },
    onError: (error) => {
      Alert.alert(
        "Error",
        error.message || "Failed to like post. Please try again."
      );
    },
    update: (cache) => {
      // Update the cache for getPosts query to ensure consistency
      cache.modify({
        fields: {
          getPosts: (existingPosts = []) => {
            return existingPosts;
          }
        }
      });
    }
  });
    if (!currentPost) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Invalid post data</Text>
      </View>
    );
  }
  
  const handlePostPress = () => {
    navigation.navigate('Detail', { post: currentPost });
  };
  
  const handleLike = () => {
    if (likeLoading) return;
    
    // Melakukan like langsung tanpa pindah ke DetailScreen
    likePost({
      variables: {
        postId: currentPost._id,
      },
    });
  };

  const handleComment = () => {
    navigation.navigate('Detail', { post: currentPost, openComments: true });
  };

  const handleShare = () => {
    console.log('Share post:', currentPost._id);
  };
  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={handlePostPress}
      activeOpacity={0.9}
    >
      <PostHeader 
        author={currentPost.author} 
        timeAgo={"1d ago"} 
      />
      
      <View style={styles.contentContainer}>
        <Text style={styles.content}>{currentPost.content}</Text>
        
        {currentPost.tags && currentPost.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {currentPost.tags.map((tag, index) => (
              <Text key={index} style={styles.tag}>{tag}</Text>
            ))}
          </View>
        )}
          {currentPost.imgUrl && (
          <Image
            source={{ uri: currentPost.imgUrl }}
            style={styles.image}
            resizeMode="cover"
          />
        )}
      </View>
      {(currentPost.likes?.length > 0 || currentPost.comments?.length > 0) && (
        <View style={styles.statsContainer}>
          {currentPost.likes?.length > 0 && (
            <View style={styles.statItem}>
              <Text style={styles.actionIcon}>{"👍"}</Text>
              <Text style={styles.statText}>{currentPost.likes.length}</Text>
            </View>
          )}
          
          {currentPost.comments?.length > 0 && (
            <TouchableOpacity 
              style={styles.commentsCount}
              onPress={handleComment}
            >
              <Text style={styles.statText}>
                {currentPost.comments.length} comments
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
      
      <PostActions 
        likes={currentPost.likes}
        comments={currentPost.comments}
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
