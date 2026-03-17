import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {

const [items, setItems] = useState([]);

useEffect(() => {
  fetch("http://10.65.68.34:3000/items")
  .then(res => res.json())
  .then(data => setItems(data))
  .catch(err => console.log(err));
}, []);

return (
<View style={styles.container}>
  <FlatList data={items} keyExtractor={(item:any) => item.id.toString()} renderItem={({item}) => (
    <View style={styles.card}>
      <Text style={styles.word}>{item.word}</Text>
      <Text style={styles.article}>{item.article?.article}</Text>
    </View>
  )}
  />
</View>
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

card:
{
padding:16,
borderBottomWidth:1,
borderBottomColor:"#333"
},

word:
{
color:"white",
fontSize:22,
fontWeight:"600"
},

article:
{
color:"#aaa",
fontSize:16,
marginTop:4
}
});