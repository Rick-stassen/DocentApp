import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import SplashScreen from "../screens/SplashScreen";

export default function HomeScreen() {

const [items, setItems] = useState([]);
const [loadingData, setLoadingData] = useState(true);
const [minTimePassed, setMinTimePassed] = useState(false);

const fadeAnim = useRef(new Animated.Value(1)).current;

const gameModes = [
  "Classic Mode",
  "Time Attack",
  "Multiplayer",
  "Practice"
];

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

    <LinearGradient
      colors={["#FD297B", "rgb(221, 11, 204)"]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.container}
    >

      <View style={styles.gameContainer}>

        <Text style={styles.title}>Game Modes</Text>

        <ScrollView showsVerticalScrollIndicator={false}>

          {gameModes.map((mode, index) => (
            <TouchableOpacity key={index} style={styles.button}>
              <Text style={styles.buttonText}>{mode}</Text>
            </TouchableOpacity>
          ))}

        </ScrollView>

      </View>

    </LinearGradient>

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
    justifyContent:"center",
    alignItems:"center",
  },

  gameContainer:{
    width:"85%",
    height:"90%", // container langer gemaakt
    backgroundColor:"white",
    borderRadius:20,
    padding:20,
    shadowColor:"#000",
    shadowOpacity:0.2,
    shadowRadius:10,
    elevation:5
  },

  title:{
    fontSize:24,
    fontWeight:"bold",
    marginBottom:20,
    textAlign:"center"
  },

  button:{
    backgroundColor:"#FD297B",
    padding:18,
    borderRadius:12,
    marginBottom:14,
    alignItems:"center"
  },

  buttonText:{
    color:"white",
    fontSize:18,
    fontWeight:"600"
  }
});