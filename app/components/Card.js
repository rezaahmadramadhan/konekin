import { useNavigation } from "@react-navigation/native";
import { Image, Text, View, TouchableOpacity } from "react-native";

export default function Card({ post }) {
  const { navigate } = useNavigation();

  const handlePress = () => {
    navigate('Detail', { post });
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={{
        backgroundColor: "#ededed",
        flexDirection: "row",
        padding: 8,
        margin: 8,
        borderRadius: 8,
        gap: 8,
      }}
    >
      <View style={{ flex: 2, gap: 5 }}>
        <Text style={{ fontSize: 16, fontWeight: "bold" }}>{post.content}</Text>
        {post.tags.map((tag, index) => (
          <Text key={index} style={{ color: "#888" }}>
            {tag}
            {index < post.tags.length - 1 ? ", " : ""}
          </Text>
        ))}
        <Image
          source={{ uri: post.imgUrl }}
          style={{
            width: "100%",
            height: 200,
            borderRadius: 8,
            marginTop: 8,
          }}
        />
        <Text style={{ color: "#888", marginTop: 8 }}>
          {post.comments.length} comments · {post.likes.length} likes
        </Text>
      </View>
    </TouchableOpacity>
  );
}
