import { useFocusEffect } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import * as React from "react";
import { useContext, useRef, useState } from "react";
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
import { UserContext } from "../../backend/UserContext.mjs";
import { storeSession } from "../../backend/stotage.mjs";

// 🔹 Icons
const MailIcon = () => (
  <Svg width={24} height={24} viewBox="0 0 960 960" fill="none" style={{ marginRight: 5 }}>
    <Path d="M160 800q-33 0-56.5-23.5T80 720v-480q0-33 23.5-56.5T160 160h640q33 0 56.5 23.5T880 240v480q0 33-23.5 56.5T800 800H160Zm320-280L160 360v400h640V360L480 520Zm0-80 320-200H160l320 200Z" fill="#55555575" />
  </Svg>
);

const LockIcon = () => (
  <Svg width={24} height={24} viewBox="0 0 960 960" style={{ marginRight: 5 }}>
    <Path
      d="M240 400v-80q0-100 70-170t170-70q100 0 170 70t70 170v80h40q33 0 56.5 23.5T840 480v240q0 33-23.5 56.5T760 800H200q-33 0-56.5-23.5T120 720V480q0-33 23.5-56.5T200 400h40Zm80 0h320v-80q0-66-47-113t-113-47q-66 0-113 47t-47 113v80Z"
      fill="#55555575"
    />
  </Svg>
);

export default function LoginScreen() {
  const router = useRouter();
  const { setUserToken } = useContext(UserContext);

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [showPopup, setShowPopup] = useState<boolean>(false);

  const screenHeight = Dimensions.get("window").height;

  const translateY = useRef(new Animated.Value(screenHeight)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const popupOpacity = useRef(new Animated.Value(0)).current;

  // 🔥 zelfde animatie reset als register
  useFocusEffect(
    React.useCallback(() => {
      translateY.setValue(screenHeight);
      opacity.setValue(0);

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
    }, [screenHeight])
  );

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
    ]).start(() => onDone && onDone());
  };

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

  const login = async () => {
    if (!email || !password) {
      showErrorPopup("Fill in all fields");
      return;
    }

    try {
      const response = await fetch("http://10.65.46.50:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        showErrorPopup(data.error || "Login failed");
        return;
      }

      await storeSession(data.token);
      setUserToken(data.token);
    } catch (err) {
      console.log(err);
      showErrorPopup("Server unreachable");
    }
  };

  const goToRegister = () => {
    animateOut(() => router.push("/(tabs)/register"));
  };

  function AnimatedButton({
    title,
    onPress,
  }: {
    title: string;
    onPress: () => void;
  }) {
    const scale = useRef(new Animated.Value(1)).current;

    return (
      <Animated.View style={{ transform: [{ scale }], marginTop: 10 }}>
        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.button}
          onPressIn={() =>
            Animated.spring(scale, { toValue: 0.95, useNativeDriver: true }).start()
          }
          onPressOut={() =>
            Animated.spring(scale, {
              toValue: 1,
              friction: 3,
              tension: 40,
              useNativeDriver: true,
            }).start()
          }
          onPress={onPress}
        >
          <Text style={styles.buttonText}>{title}</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient colors={["#FD297B", "rgb(221, 11, 204)"]} style={styles.container}>
        <View style={styles.gameContainer}>
          <Text style={styles.gameTitle}>Wordplay</Text>
        </View>

        {showPopup && (
          <Animated.View style={[styles.popup, { opacity: popupOpacity }]}>
            <Text style={{ color: "white", fontWeight: "bold" }}>{error}</Text>
          </Animated.View>
        )}

        <Animated.View style={[styles.card, { transform: [{ translateY }], opacity }]}>
          <Text style={styles.titleregistreer}>Login</Text>

          <View style={styles.inputContainer}>
            <MailIcon />
            <TextInput
              style={styles.textInputWithIcon}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.inputContainer}>
            <LockIcon />
            <TextInput
              style={styles.textInputWithIcon}
              placeholder="Password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <AnimatedButton title="Login" onPress={login} />

          <TouchableOpacity style={styles.loginLink} onPress={goToRegister}>
            <Text style={styles.loginLinkText}>
              No account?{" "}
              <Text style={{ color: "#FD297B", fontWeight: "bold" }}>
                Register!
              </Text>
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </LinearGradient>
    </View>
  );
}

// 🎨 IDENTIEKE STYLES ALS REGISTER
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
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },

card: {
  position: "absolute",
  width: "85%",
  backgroundColor: "white",
  borderRadius: 20,
  padding: 20,

  alignSelf: "center",

  top: 0,
  bottom: 0,
  justifyContent: "center",

  zIndex: 10,

  shadowColor: "#000",
  shadowOpacity: 0.25,
  shadowRadius: 15,
  elevation: 10,
},

  gameTitle: {
    color: "#000",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },

  titleregistreer: { marginBottom: 20, fontSize: 24, fontWeight: "bold", textAlign: "center", color: "#FD297B" },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    marginBottom: 15,
    paddingHorizontal: 10,
  },

  textInputWithIcon: {
    flex: 1,
    height: 50,
  },

  button: {
    backgroundColor: "#FD297B",
    padding: 18,
    borderRadius: 12,
  },

  buttonText: {
    color: "white",
    textAlign: "center",
  },

  popup: {
    position: "absolute",
    top: 150,
    backgroundColor: "red",
    padding: 10,
    borderRadius: 10,
  },

  loginLink: {
    marginTop: 15,
    alignItems: "center",
  },

  loginLinkText: {
    color: "#555",
  },
});