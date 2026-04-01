import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
import { getSession } from "../../backend/stotage.mjs";

export default function Profile() {
  const [items, setItems] = useState<any[]>([]);

  type WordItem = {
    id: number;
    word: string;
    correct: number;
    litwoord: string;
  };

  const totalCount = items.length;
  const correctCount = items.filter(i => i.correct === 1).length;
  const wrongCount = items.filter(i => i.correct === 0).length;

  useEffect(() => 
    {
      async function loadProfile() 
      {
        const token = await getSession();

        const res = await fetch("http://localhost:3000/profile", 
        {
          method: "GET",
          headers: 
          {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        setItems(data.slice(0, 29129));
      }

      loadProfile().catch(err => console.log(err));
    },[]);

  return (
    <LinearGradient
      colors={["#FD297B", "rgb(221, 11, 204)"]}
      style={styles.container}
    >
      <Text style={styles.header}>Profile</Text>

      <View style={styles.cardContainer}>
        <Text style={styles.title}>Learned Words</Text>

        <ScrollView style={styles.list}>
          <Text style={styles.word}>Total: {totalCount}</Text>
          <Text style={styles.word}>Correct: {correctCount}</Text>
          <Text style={styles.word}>Wrong: {wrongCount}</Text>
        </ScrollView>
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
    padding: 20,
  },

  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },

  list: {
    marginTop: 10,
  },

  wordRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },

  article: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FD297B",
  },

  word: {
    fontSize: 16,
    color: "#333",
  },
});