import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import SplashScreen from "../screens/SplashScreen";

export default function HomeScreen() {

const [items, setItems] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  fetch("http://10.65.68.86:3000/items")
    .then(res => res.json())
    .then(data => {
      setItems(data);
      setLoading(false);
    })
    .catch(err => {
      console.log(err);
      setLoading(false);
    });
}, []);

if(loading){
  return <SplashScreen/>
}

return (
  <View style={styles.container}>
    <FlatList
      data={items}
      keyExtractor={(item:any) => item.id.toString()}
      renderItem={({item}) => (
        <Text style={styles.text}>{item.word}</Text>
      )}
    />
  </View>
);
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:"black",
    paddingTop:60,
    paddingHorizontal:20,
  },
  text:{
    color:"white",
    fontSize:20,
    padding:12,
    borderBottomWidth:1,
    borderBottomColor:"#333"
  }
});
