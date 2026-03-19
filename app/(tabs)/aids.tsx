import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

interface ArticleCuratedWord {
  id: number;
  article_id: number;
  curatedword_id: number;
}

export default function aidstab() {

  const [items, setItems] = useState<ArticleCuratedWord[]>([]);

useEffect(() => {
  fetch("http:// 10.65.42.52:3000/WordConnect")
    .then(res => res.json())
    .then((data: ArticleCuratedWord[]) => {
      const simplified = data.map((item: ArticleCuratedWord) => ({
        id: item.id,
        article_id: item.article_id,
        curatedword_id: item.curatedword_id
      }));
      setItems(simplified);
      console.log(simplified);
    })
    .catch(err => console.log(err));
}, [])

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
             <Text style={styles.text}>ID: {item.id}</Text>
            <Text style={styles.text}>Article ID: {item.article_id}</Text>
            <Text style={styles.text}>Curated Word ID: {item.curatedword_id}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  itemContainer: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  text: {
    color: "white",
    fontSize: 16,
  },
});