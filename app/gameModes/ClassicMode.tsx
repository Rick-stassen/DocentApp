import { LinearGradient } from "expo-linear-gradient";
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { getSession } from "../../backend/stotage.mjs";

export default function HomeScreen() {
  const LESSON_SIZE = 10;

  const [items, setItems] = useState<any[]>([]);
  const [currentItem, setCurrentItem] = useState<any>(null);
  const [itemIndex, setItemIndex] = useState(0);

  const [answers, setAnswers] = useState<(boolean | null)[]>([]);

  const [isVisibleFalse, setIsVisibleFalse] = useState(false);
  const [isVisibleTrue, setIsVisibleTrue] = useState(false);
  const [wrongItems, setWrongItems] = useState<any[]>([]);


  useEffect(() => 
  {
    async function loadItems() 
    {
      const token = await getSession();

      const res = await fetch("http://localhost:3000/items", 
      {
        method: "GET",
        headers: 
        {
          Authorization: `Bearer ${token}`,
        },
      }
    );

      const data = await res.json();

      const limited = data.slice(0, LESSON_SIZE);

      setItems(limited);
      setCurrentItem(limited[0]);
      setItemIndex(0);
      setAnswers(new Array(LESSON_SIZE).fill(null));
    }

    loadItems().catch(err => console.log(err));
  },[]);

  async function RecieveAnswer(answer: string) 
  {
    if (!currentItem) return;

     const token = await getSession();

    const isCorrect = currentItem.article.toLowerCase() === answer.toLowerCase();

    //SEND TO DATABASE
    await fetch("http://localhost:3000/learned_word", 
      {
      method: "POST",
      headers: 
      {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        token: token,
        id: currentItem.id,
        word: currentItem.word,
        correct: isCorrect,
        litwoord: currentItem.article,
      }),
    }).catch(err => console.log(err));
    // store result locally
    setAnswers(prev => {
      const updated = [...prev];
      updated[itemIndex] = isCorrect;
      return updated;
    });
    
    // feedback UI
    if (!isCorrect) 
    {
      setWrongItems(prev => [...prev, currentItem]);
    }

    // next item
    setTimeout(() => {
  const nextIndex = itemIndex + 1;

  if (nextIndex < items.length) {
    setItemIndex(nextIndex);
    setCurrentItem(items[nextIndex]);
  } 
  else if (wrongItems.length > 0) {
    // start ronde met fouten
    setItems(wrongItems);
    setWrongItems([]);
    setItemIndex(0);
    setCurrentItem(wrongItems[0]);

    // reset progress
    setAnswers(new Array(wrongItems.length).fill(null));
  } 
  else 
  {
    setCurrentItem(null);
    setTimeout(() => {
      router.push('../intro');
    }, 500);
    }
  }, 470);
  }

  function AnimatedButton({ title }: { title: string }) {
    const scale = useRef(new Animated.Value(1)).current;

    const pressIn = () => {
      Animated.spring(scale, {
        toValue: 0.85,
        useNativeDriver: true,
      }).start();
    };

    const pressOut = () => {
      Animated.spring(scale, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }).start();
    };

    return (
      <Animated.View style={{ transform: [{ scale }], flex: 1, marginHorizontal: 5 }}>
        <TouchableOpacity
          style={styles.button}
          onPressIn={pressIn}
          onPressOut={pressOut}
          onPress={() => RecieveAnswer(title)}
        >
          <Text style={styles.buttonText}>{title}</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  return (
    <LinearGradient
      colors={["#FD297B", "rgb(221, 11, 204)"]}
      style={styles.container}
    >
      <Text style={styles.header}>Wordplay</Text>

      <View style={styles.cardContainer}>

        <Text style={styles.topRightText}>
          {itemIndex + 1} / {LESSON_SIZE}
        </Text>

        <View style={styles.progressContainer}>
          {answers.map((ans, index) => (
            <View
              key={index}
              style={[
                styles.segment,
                ans === true && styles.correctSegment,
                ans === false && styles.wrongSegment,
              ]}
            />
          ))}
        </View>

        {currentItem && (
          <View style={styles.wordCard}>
            <Text style={styles.wordText}>{currentItem.word}</Text>
          </View>
        )}

        {isVisibleTrue && (
          <View style={styles.correctBox}>
            <Text style={styles.icon}>✔</Text>
          </View>
        )}

        {isVisibleFalse && (
          <View style={styles.wrongBox}>
            <Text style={styles.icon}>✖</Text>
          </View>
        )}

        <View style={styles.buttonsContainer}>
          <AnimatedButton title="DE" />
          <AnimatedButton title="HET" />
        </View>

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
    alignItems: "center",
    justifyContent: "space-between",
    position: "relative",
  },

  topRightText: {
    position: "absolute",
    top: 15,
    right: 20,
    fontSize: 14,
    color: "#333",
  },

  progressContainer: {
    flexDirection: "row",
    width: "100%",
    height: 10,
    marginTop: 30,
  },

  segment: {
    flex: 1,
    marginHorizontal: 2,
    backgroundColor: "#eee",
    borderRadius: 5,
  },

  correctSegment: {
    backgroundColor: "#29fd3e",
  },

  wrongSegment: {
    backgroundColor: "red",
  },

  wordCard: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  wordText: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
  },

  buttonsContainer: {
    flexDirection: "row",
    width: "100%",
  },

  button: {
    backgroundColor: "#FD297B",
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
  },

  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },

  correctBox: {
    position: "absolute",
    top: "40%",
    backgroundColor: "green",
    padding: 20,
    borderRadius: 10,
  },

  wrongBox: {
    position: "absolute",
    top: "40%",
    backgroundColor: "red",
    padding: 20,
    borderRadius: 10,
  },

  icon: {
    color: "white",
    fontSize: 30,
    fontWeight: "bold",
  },
});