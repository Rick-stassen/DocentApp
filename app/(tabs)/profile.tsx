import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function Profile() {
  const [sum, setSum] = useState(0);

  useFocusEffect(
    useCallback(() => {
      const interval = setInterval(() => {
        setSum((prev) => prev + 1);
      }, 2000);

      return () => clearInterval(interval);
    }, [])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Sum: {sum}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    position: "absolute",
    top: "50%",
    right: "50%",
    fontSize: 24,
    color: "#333",
  },
});