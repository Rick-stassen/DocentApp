import { useNavigation } from "@react-navigation/native"; // <-- import navigation hook
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

  const navigation = useNavigation(); // <-- hook voor navigatie

  const [items, setItems] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [minTimePassed, setMinTimePassed] = useState(false);

  const fadeAnim = useRef(new Animated.Value(1)).current;

  const gameModes = [
    { name: "Classic Mode", screen: "ClassicMode"},
    { name: "Time Attack", screen: "TimeAttack" },
    { name: "Multiplayer", screen: "Multiplayer" },
    { name: "Practice", screen: "Practice" },
  ];

  useEffect(() => {
    fetch("http://10.65.46.48:3000/items")
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
    }, 1200);

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


  // -------- Animated Button Component --------
  function AnimatedButton({ title, screen }: { title: string; screen: string }) {

    const scale = useRef(new Animated.Value(1)).current;

    const pressIn = () => {
      Animated.spring(scale, {
        toValue: 0.65,
        useNativeDriver: true
      }).start();
    };

    const pressOut = () => {
      Animated.spring(scale, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true
      }).start();
    };

    const handlePress = () => {
      // kleine delay van 200ms voor animatie
      setTimeout(() => {
        navigation.navigate(screen as never); // 'as never' nodig voor TS
      }, 200);
    };

    return (
      <Animated.View style={{ transform: [{ scale }], marginBottom: 14 }}>
        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.button}
          onPressIn={pressIn}
          onPressOut={pressOut}
          onPress={handlePress}
        >
          <Text style={styles.buttonText}>{title}</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  }


  return (
    <View style={{ flex: 1 }}>

      {/* Gradient achtergrond */}
      <LinearGradient
        colors={["#FD297B", "rgb(221, 11, 204)"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.container}
      >

        {/* Witte container */}
        <View style={styles.gameContainer}>

          <Text style={styles.title}>Game Modes</Text>

          <ScrollView showsVerticalScrollIndicator={false}>
            {gameModes.map((mode, index) => (
              <AnimatedButton key={index} title={mode.name} screen={mode.screen} />
            ))}
          </ScrollView>

        </View>

      </LinearGradient>

      {/* Splashscreen fade */}
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
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  gameContainer: {
    width: "85%",
    height: "90%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center"
  },

  button: {
    backgroundColor: "#FD297B",
    padding: 18,
    borderRadius: 12,
    alignItems: "center"
  },

  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600"
  }
});