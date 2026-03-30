import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Path } from "react-native-svg";

// 🔹 SVG Iconen
const MailIcon = () => (
  <Svg width={24} height={24} viewBox="0 0 960 960" fill="none" style={{ marginRight: 5 }}>
    <Path
      d="M160 800q-33 0-56.5-23.5T80 720v-480q0-33 23.5-56.5T160 160h640q33 0 56.5 23.5T880 240v480q0 33-23.5 56.5T800 800H160Zm320-280L160 360v400h640V360L480 520Zm0-80 320-200H160l320 200Z"
      fill="#55555575"
    />
  </Svg>
);

const UserIcon = () => (
  <Svg width={24} height={24} viewBox="0 -960 960 960" fill="none" style={{ marginRight: 5 }}>
    <Path
      d="M367-527q-47-47-47-113t47-113q47-47 113-47t113 47q47 47 47 113t-47 113q-47 47-113 47t-113-47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm296.5-343.5Q560-607 560-640t-23.5-56.5Q513-720 480-720t-56.5 23.5Q400-673 400-640t23.5 56.5Q447-560 480-560t56.5-23.5ZM480-640Zm0 400Z"
      fill="#55555575"
    />
  </Svg>
);

const LockIcon = () => (
  <Svg width={24} height={24} viewBox="0 0 960 960" fill="none" style={{ marginRight: 5 }}>
    <Path
      d="M80 760v-80h800v80H80Zm46-242-52-30 34-60H40v-60h68l-34-58 52-30 34 58 34-58 52 30-34 58h68v60h-68l34 60-52 30-34-60-34 60Zm320 0-52-30 34-60h-68v-60h68l-34-58 52-30 34 58 34-58 52 30-34 58h68v60h-68l34 60-52 30-34-60-34 60Zm320 0-52-30 34-60h-68v-60h68l-34-58 52-30 34 58 34-58 52 30-34 58h68v60h-68l34 60-52 30-34-60-34 60Z"
      fill="#55555575"
    />
  </Svg>
);

export default function RegisterScreen() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const screenHeight = Dimensions.get("window").height;

  // 🔥 Animatie values
  const translateY = useRef(new Animated.Value(screenHeight)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const popupOpacity = useRef(new Animated.Value(0)).current;

  // 🚀 Bij openen → omhoog
  useEffect(() => {
    Animated.parallel([
      Animated.spring(translateY, {
        toValue: 0,
        friction: 6,
        tension: 50,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // 🔽 Naar beneden animatie + callback
  const animateOut = (onDone?: () => void) => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: screenHeight,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (onDone) onDone();
    });
  };

  // ⚡ Pop-up animatie
  const showErrorPopup = (message: string) => {
    setError(message);
    setShowPopup(true);
    Animated.timing(popupOpacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    setTimeout(() => {
      Animated.timing(popupOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setShowPopup(false);
        setError("");
      });
    }, 2500);
  };

  // 🔹 Registratie functie met e-mailvalidatie en check voor bestaande account
  const handleRegister = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showErrorPopup("Please enter a valid email address");
      return;
    }

    if (!username || !password) {
      showErrorPopup("Username and password cannot be empty");
      return;
    }

    try {
      const response = await fetch("http://10.65.68.42:3000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, username }),
      });

      const data = await response.json();

      if (data.usernameExists) {
        showErrorPopup("Username is already in use");
      } else if (data.emailExists) {
        showErrorPopup("Email is already in use");
      } else {
        setError("");
        animateOut(() => {
          router.push("/(tabs)/login");
        });
      }
    } catch (err) {
      console.log(err);
      showErrorPopup("An error occurred. Try again!");
    }
  };

  const goToLogin = () => {
    animateOut(() => router.push("/(tabs)/login"));
  };

  function AnimatedButton({ title, onPress }: { title: string; onPress: () => void }) {
    const scale = useRef(new Animated.Value(1)).current;

    const pressIn = () => {
      Animated.spring(scale, { toValue: 0.95, useNativeDriver: true }).start();
    };

    const pressOut = () => {
      Animated.spring(scale, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }).start();
    };

    return (
      <Animated.View style={{ transform: [{ scale }], marginTop: 10 }}>
        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.button}
          onPressIn={pressIn}
          onPressOut={pressOut}
          onPress={onPress}
        >
          <Text style={styles.buttonText}>{title}</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={["#FD297B", "rgb(221, 11, 204)"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.container}
      >
        <View style={styles.gameContainer}>
          <Text style={styles.title}>Wordplay</Text>
        </View>

        {showPopup && (
          <Animated.View style={[styles.popup, { opacity: popupOpacity }]}>
            <Text style={{ color: "white", fontWeight: "bold" }}>{error}</Text>
          </Animated.View>
        )}

        <Animated.View style={[styles.card, { transform: [{ translateY }], opacity }]}>
          <Text style={styles.titleregistreer}>Register</Text>

          <View style={styles.inputContainer}>
            <MailIcon />
            <TextInput
              style={styles.textInputWithIcon}
              placeholder="Email"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <UserIcon />
            <TextInput
              style={styles.textInputWithIcon}
              placeholder="Username"
              placeholderTextColor="#999"
              value={username}
              onChangeText={setUsername}
            />
          </View>

          <View style={styles.inputContainer}>
            <LockIcon />
            <TextInput
              style={styles.textInputWithIcon}
              placeholder="Password"
              placeholderTextColor="#999"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <AnimatedButton title="Register" onPress={handleRegister} />

          <TouchableOpacity style={styles.loginLink} onPress={goToLogin}>
            <Text style={styles.loginLinkText}>
              Already have an account?{" "}
              <Text style={{ color: "#FD297B", fontWeight: "bold" }}>Login!</Text>
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  gameContainer: {
    position: "absolute",
    width: "85%",
    height: "90%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  card: {
    width: "85%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  title: { color: "#000", fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  titleregistreer: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center", color: "#FD297B" },
  inputContainer: { flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: "#ddd", borderRadius: 12, paddingHorizontal: 10, marginBottom: 15, backgroundColor: "white" },
  textInputWithIcon: { flex: 1, height: 50, fontSize: 16, color: "#000", marginLeft: 5 },
  button: { backgroundColor: "#FD297B", padding: 18, borderRadius: 12, alignItems: "center", marginTop: 10 },
  buttonText: { color: "white", fontSize: 18, fontWeight: "600" },
  popup: { position: "absolute", top: 150, backgroundColor: "red", paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10, alignSelf: "center", zIndex: 10 },
  loginLink: { marginTop: 15, alignSelf: "center" },
  loginLinkText: { color: "#555", fontSize: 14 },
});