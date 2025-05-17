import { ScrollView, StyleSheet, View, Text } from "react-native";
import Card from "../components/Card";
import { gql, useQuery } from "@apollo/client";

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

export default function HomeScreen() {
  const { loading, error, data } = useQuery(GET_POSTS, {
    fetchPolicy: 'network-only', // Menghindari cache dan selalu mengambil data dari server
    onError: (error) => {
      console.error("Apollo error details:", error);
      console.error("Network error:", error.networkError);
      if (error.networkError && error.networkError.result) {
        console.error("Network error details:", error.networkError.result);
      }
      console.error("GraphQL errors:", error.graphQLErrors);
    }
  });

  if (loading)
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
    
  if (error) {
    console.error("Error fetching posts:", error);
    return (
      <View style={styles.container}>
        <Text>Error loading posts: {error.message}</Text>
        {error.networkError && (
          <Text>Network error: {JSON.stringify(error.networkError)}</Text>
        )}
      </View>
    );
  }
  
  console.log("Data received:", data);
  
  if (!data || !data.getPosts) {
    return (
      <View style={styles.container}>
        <Text>No posts found. This might be due to authentication issues.</Text>
      </View>
    );
  }
  
  return (
    <ScrollView>
      <View style={styles.container}>
        {data.getPosts.map((post, index) => (
          <Card key={index} post={post} />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
});
