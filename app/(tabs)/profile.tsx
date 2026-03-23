import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  View
} from "react-native";

export default function ProfileScreen() {
  const [words, setWords] = useState<any[]>([]);

  useEffect(() => {
    fetch("http://10.65.68.44:3000/learned-words")
      .then(res => res.json())
      .then(data => setWords(data))
      .catch(err => console.log(err));
  }, []);

  function renderItem({ item }: any) {
    return (
      <View style={styles.wordRow}>
        <Text style={styles.word}>{item.word}</Text>
        <Text style={styles.article}>{item.article}</Text>
        <Text style={[
          styles.result,
          item.correct ? styles.correct : styles.wrong
        ]}>
          {item.correct ? "✔" : "✖"}
        </Text>
      </View>
    );
  }

  return (
    <LinearGradient
      colors={["#FD297B", "rgb(221, 11, 204)"]}
      style={styles.container}
    >
      <Text style={styles.header}>Your Words</Text>

      <View style={styles.cardContainer}>
        <FlatList
          data={words}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
        />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 60,
  },

  header: {
    color: "white",
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 10,
  },

  cardContainer: {
    width: "85%",
    height: "80%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 10,
  },

  wordRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },

  word: {
    fontSize: 16,
    fontWeight: "600",
  },

  article: {
    fontSize: 16,
    color: "#555",
  },

  result: {
    fontSize: 18,
    fontWeight: "bold",
  },

  correct: {
    color: "green",
  },

  wrong: {
    color: "red",
  },
});