import { LinearGradient } from "expo-linear-gradient";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

export default function SplashScreen() {
  return (
    <LinearGradient
      colors={["#FD297B", "rgb(221, 11, 204)"]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.container}
    >
      <View style={styles.box}>
        <Text style={styles.title}>WORDPLAY!</Text>

        <ActivityIndicator
          size="large"
          color="#FD297B"
          style={styles.loader}
        />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  box: {
    width: "85%",
    height: "90%",
    backgroundColor: "white",
    borderRadius: 20,
    alignItems: "center",
    paddingTop: 120,
    justifyContent: "space-between",
    paddingBottom: 40,
  },

  title: {
    fontSize: 40,
    fontWeight: "bold",
    color: "black",
  },

  loader: {
    marginBottom: 30,
  },
});