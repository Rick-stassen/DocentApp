import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function HomeScreen() {
  const [items, setItems] = useState([]);
  const [currentItem, setCurrentItem] = useState<any>(null);
  const [itemIndex, setItemIndex] = useState(0);
  var [isVisibleFalse, setIsVisibleFalse] = useState<boolean>(false);
  var [isVisibleTrue, setIsVisibleTrue] = useState<boolean>(false);
  const [ip, setIp] = useState("");
  const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));


  
  useEffect(() => {
    fetch("/api/ip")
      .then(res => res.json())
      .then(data => setIp(data.ip));
  }, []);

  useEffect(() => {
    fetch("http://10.65.68.75:3000/items")
      .then(res => res.json())
      .then(data => {
        setItems(data);
        setCurrentItem(data[0]);
      })
      .catch(err => console.log(err));
  }, []);

  const handleClick = (answer: string) => {
    RecieveAnswer(answer);
  };

  function RecieveAnswer(answer: string) {
    if (!currentItem) return;

    const isCorrect = currentItem.article.toLowerCase() === answer.toLowerCase();

    if (isCorrect === true) {
      setIsVisibleTrue(true);
      console.log("correct antwoordtrue");
      setTimeout(() => {
        setIsVisibleTrue(false);
      }, 500);
    }

    if (isCorrect !== true) {
      console.log("fout antwoordfalse");
      setIsVisibleFalse(true);
      setTimeout(() => {
        setIsVisibleFalse(false);
      }, 500);
    }
    const nextIndex = itemIndex + 1;
    if (nextIndex < items.length) {
      setItemIndex(nextIndex);
      setCurrentItem(items[nextIndex]);
    }
  }

  return (
    <View style={styles.container}>
      {currentItem && (
        <View style={styles.card}>
          <Text style={styles.text}>{currentItem.word}</Text>
        </View>
      )}

     {isVisibleTrue && 
        (
          <View style={styles.correctBox}><Text style={styles.icon}>✔</Text></View>
        )
      }
      
      {isVisibleFalse && 
        (
          <View style={styles.wrongBox}><Text style={styles.icon}>✖</Text></View>
        )
      }

      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.btnLinks} onPress={() => handleClick("DE")}>
          <Text>DE</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnRight} onPress={() => handleClick("HET")}>
          <Text>HET</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    paddingTop: 60,
    paddingHorizontal: 20,
    alignItems: "center"
  },
  wrongBox: {
    justifyContent: "center",
    alignItems: "center",
    width: 100,
    height: 100,
    backgroundColor: "red",
    borderRadius: 10,
    marginBottom: 20,
  },
  correctBox: {
    justifyContent: "center",
    alignItems: "center",
    width: 100,
    height: 100,
    backgroundColor: "green",
    borderRadius: 10,
    marginBottom: 20,
  },
  icon: {
    color: "white",
    fontSize: 40,
    fontWeight: "bold",
  },
  card: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    padding: 10,
    backgroundColor: "#111"
  },
  text: {
    color: "white",
    fontSize: 20,
    padding: 5
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    position: "absolute",
    bottom: 20,
    width: "100%"
  },
  btnLinks: {
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    backgroundColor: "blue"
  },
  btnRight: {
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    backgroundColor: "blue"
  }
});