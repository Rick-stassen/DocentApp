import { StyleSheet, Text, View } from "react-native";

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>WORDPLAY!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor:"#d98f8f",
    justifyContent:"center",
    alignItems:"center"
  },
  title:{
    fontSize:40,
    fontWeight:"bold"
  }
});
