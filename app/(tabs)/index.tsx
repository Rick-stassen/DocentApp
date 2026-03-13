import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {

const [items, setItems] = useState([]);

useEffect(() => 
{
  fetch("http://192.168.2.10:3000/items")
  .then(res => res.json())
  .then(data => setItems(data))
  .catch(err => console.log(err));
}, []);

return (
  <View style={styles.container}>
    <FlatList data={items} keyExtractor={(item:any) => item.id.toString()} renderItem={({item}) => 
    (
      <Text style={styles.text}>{item.word}</Text>
    )
  }/></View>
  );
  }

const styles = StyleSheet.create({
  container:
    {
      flex:1,
      backgroundColor:"black",
      paddingTop:60,
      paddingHorizontal:20,
    },
  text:
  {
    color:"white",
    fontSize:20,
    padding:12,
    borderBottomWidth:1,
    borderBottomColor:"#333"
  }
});