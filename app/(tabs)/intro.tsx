import { useEffect, useRef, useState } from "react";
import { Animated, FlatList, StyleSheet, Text, View } from "react-native";
import SplashScreen from "../screens/SplashScreen";

export default function HomeScreen() {

const [items, setItems] = useState([]);
const [loadingData, setLoadingData] = useState(true);
const [minTimePassed, setMinTimePassed] = useState(false);

const fadeAnim = useRef(new Animated.Value(1)).current;

useEffect(() => {

  fetch("http://10.65.46.70:3000/items")
    .then(res => res.json())
    .then(data => {
      setItems(data);
      setLoadingData(false);
    })
    .catch(err => {
      console.log(err);
      setLoadingData(false);
    });

  const timer = setTimeout(() => {
    setMinTimePassed(true);
  }, 3000);

  return () => clearTimeout(timer);

}, []);

useEffect(() => {
  if (!loadingData && minTimePassed) {

    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: true
    }).start();

  }
}, [loadingData, minTimePassed]);

return (
  <View style={{flex:1}}>

    {/* Home screen staat er altijd al onder */}
    <View style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={(item:any) => item.id.toString()}
        renderItem={({item}) => (
          <Text style={styles.text}>{item.word}</Text>
        )}
      />
    </View>

    {/* Splash screen fade eroverheen */}
    <Animated.View
      pointerEvents="none"
      style={[
        StyleSheet.absoluteFill,
        { opacity: fadeAnim }
      ]}
    >
      <SplashScreen />
    </Animated.View>

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