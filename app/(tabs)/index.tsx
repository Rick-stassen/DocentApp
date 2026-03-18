import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function HomeScreen() {
  var [items, setItems] = useState([]);
  var [currentItem, setCurrentItem] = useState<any>(null);
  const [itemIndex, setItemIndex] = useState(0);


      const [ip, setIp] = useState("");

    useEffect(() => {
        fetch("/api/ip")
            .then(res => res.json())
            .then(data => setIp(data.ip));
    }, []);



  useEffect(() => {
    fetch("http://10.65.68.75:3000/items")
      .then(res => res.json())
      .then(data => 
      { setItems(data)
        setCurrentItem(data[0])
      })
      .catch(err => console.log(err));
  }, []);

  const handleClick = (answer: string) => {
    RecieveAnswer(answer);
  };

function RecieveAnswer(answer: string) 
  {
    if (!currentItem) return;

    const isCorrect =
    currentItem.article.toLowerCase() === answer.toLowerCase();

    alert(isCorrect ? "goed" : "fout");

    const nextIndex = itemIndex + 1;

    if (nextIndex < items.length) 
    {
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
    flex:1,
    backgroundColor:"black",
    paddingTop:60,
    paddingHorizontal:20,
  },
  card: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    padding: 10,
    backgroundColor:"#111"
  },
  text: {
    color:"white",
    fontSize:20,
    padding:5
  },
  buttonsContainer: {
    flexDirection:"row",
    justifyContent:"space-around",
    position:"absolute",
    bottom:20,
    width:"100%"
  },
  btnLinks: {
    justifyContent:"center",
    alignItems:"center",
    padding:15,
    backgroundColor:"blue"
  },
  btnRight: {
    justifyContent:"center",
    alignItems:"center",
    padding:15,
    backgroundColor:"blue"
  }
});