import { ScrollView, StyleSheet, View } from "react-native";
import Card from "../components/Card";

export default function HomeListScreen() {
  const posts = [
    {
      content: `"Logic di backend? Beres.
Milih makan siang? Ngga bisa." 😢 

Sebagai backend developer, kalian pasti terbiasa berpikir logis dan menangani berbagai kasus:
 • "API bermasalah? Logging dan debugging"
 • "Query lambat? Cek index dan optimasi"
 • "Alur kompleks? Pecah jadi microservice"

Tapi semua skill itu tiba-tiba hilang… saat buka GoFood.
Scroll 10 menit lebih, filter udah dipakai, rating udah disortir
tapi tetap aja:
"Laper sih… tapi kok ngga ada yang pengen?"

Akhirnya nyerah, jalan ke warteg.
Berdiri di depan etalase lauk-lauk yang menggoda.
Tapi otak malah freeze.
"Telur balado atau ayam goreng? Tapi ada sambal teri juga… duh."

Ironisnya, di dunia code bisa mantap ambil keputusan penting:
 • Nentuin struktur API
 • Pilih pendekatan terbaik untuk handle error
 • Pecah flow jadi lebih efisien

Tapi di depan lauk warteg?
"DecisionErrorException: Too many delicious options."

Kadang, yang paling berat itu bukan logic coding…
Tapi logic perut.`,
      tags: [
        "#BackendDeveloper",
        "#LogicThinking",
        "#ProgrammingLife",
        "#BelajarNgoding",
        "#SharingIlmu",
        "#CodingMindset",
        "#DevanSurya",
      ],
      imgUrl:
        "https://media.licdn.com/dms/image/v2/D5622AQFNthA4HCvZtw/feedshare-shrink_800/B56ZYtvpKPH0Ag-/0/1744524187334?e=1750291200&v=beta&t=AXuCJqbUyedAB0rvcYPEVUV0hhh56RAeAtwGnk7ga1Y",
      authorId: "68245c23bedbd56ff3c9196f",
      comments: [
        {
          username: "andi",
          content: "hahahahaha",
          createdAt: "2025-05-14T17:04:42.142Z",
          updatedAt: "2025-05-14T17:04:42.142Z",
        },
        {
          username: "budi",
          content: "wkwkwkw",
          createdAt: "2025-05-14T17:04:42.142Z",
          updatedAt: "2025-05-14T17:04:42.142Z",
        },
        {
          username: "zalvin",
          content: "lucu banget tuhh",
          createdAt: "2025-05-14T17:04:42.142Z",
          updatedAt: "2025-05-14T17:04:42.142Z",
        },
        {
          username: "ika",
          content: "ironi developerkuu",
          createdAt: "2025-05-14T17:04:42.142Z",
          updatedAt: "2025-05-14T17:04:42.142Z",
        },
        {
          username: "alvan",
          content: "relate bangett",
          createdAt: "2025-05-14T17:04:42.142Z",
          updatedAt: "2025-05-14T17:04:42.142Z",
        },
      ],
      likes: [
        {
          username: "andi",
          createdAt: "2025-05-14T17:04:42.142Z",
          updatedAt: "2025-05-14T17:04:42.142Z",
        },
        {
          username: "budi",
          createdAt: "2025-05-14T17:04:42.142Z",
          updatedAt: "2025-05-14T17:04:42.142Z",
        },
        {
          username: "zalvin",
          createdAt: "2025-05-14T17:04:42.142Z",
          updatedAt: "2025-05-14T17:04:42.142Z",
        },
      ],
      author: {
        username: "Devan Surya",
      },
    },
  ];

  return (
    <ScrollView>
      <View style={styles.container}>
        {posts.map((post, index) => (
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
