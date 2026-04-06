import { useFocusEffect } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import * as React from "react";
import { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TextStyle,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Path } from "react-native-svg";

/* ICONS */
const MailIcon = () => (
  <Svg width={24} height={24} viewBox="0 0 960 960" style={{ marginRight: 5 }}>
    <Path
      d="M160 800q-33 0-56.5-23.5T80 720v-480q0-33 23.5-56.5T160 160h640q33 0 56.5 23.5T880 240v480q0 33-23.5 56.5T800 800H160Zm320-280L160 360v400h640V360L480 520Zm0-80 320-200H160l320 200Z"
      fill="#55555575"
    />
  </Svg>
);

const UserIcon = () => (
  <Svg width={24} height={24} viewBox="0 -960 960 960" style={{ marginRight: 5 }}>
    <Path
      d="M367-527q-47-47-47-113t47-113q47-47 113-47t113 47q47 47 47 113t-47 113q-47 47-113 47t-113-47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Z"
      fill="#55555575"
    />
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

export default function RegisterScreen() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [tags, setTags] = useState("0000");
  const [usernameInput, setUsernameInput] = useState("");

  const [error, setError] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  const screenHeight = Dimensions.get("window").height;

  const translateY = useRef(new Animated.Value(screenHeight)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const popupOpacity = useRef(new Animated.Value(0)).current;

  // 🔥 SAME ENTER ANIMATION AS LOGIN
  useFocusEffect(
    React.useCallback(() => {
      translateY.setValue(screenHeight);
      opacity.setValue(0);
      popupOpacity.setValue(0);
      setShowPopup(false);
      setError("");

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

  // 🔥 FIXED EXIT ANIMATION
  const animateOut = (onDone?: () => void) => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: screenHeight,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start(() => {
      requestAnimationFrame(() => onDone?.());
    });
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

    const finalTags = (tags || "0000").slice(0, 4).padEnd(4, "0");

    try {
      const response = await fetch("http://localhost:3000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          username,
          tags: finalTags,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        showErrorPopup(data.error || "Register failed");
        return;
      }

      animateOut(() => {
        setTimeout(() => router.push("../login"), 50);
      });

    } catch {
      showErrorPopup("Server unreachable");
    }
  };

  const goToLogin = () => {
    animateOut(() => {
      setTimeout(() => router.push("../login"), 50);
    });
  };

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
          <Text style={styles.title}>Register</Text>

          {/* EMAIL */}
          <View style={[styles.inputContainer, focusedInput === "email" && styles.inputContainerFocused]}>
            <MailIcon />
            <TextInput
              style={styles.textInputWithIcon as TextStyle}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              onFocus={() => setFocusedInput("email")}
              onBlur={() => setFocusedInput(null)}
              selectionColor="#FD297B"
            />
          </View>

          {/* USERNAME */}
          <View style={[styles.inputContainer, focusedInput === "username" && styles.inputContainerFocused]}>
            <UserIcon />
            <TextInput
              style={styles.textInputWithIcon as TextStyle}
              placeholder="Username#0000"
              value={usernameInput}
              onChangeText={(text) => {
                const parts = text.split("#");

                const newUsername = parts[0] ?? "";
                const newTagsRaw = parts[1] ?? "";

                const cleanedTags = newTagsRaw.replace(/[^0-9a-zA-Z]/g, "").slice(0, 4);
                const finalTags = cleanedTags.length > 0 ? cleanedTags : "0000";

                const safeValue =
                  newUsername + (text.includes("#") ? "#" : "") + cleanedTags;

                setUsernameInput(safeValue);
                setUsername(newUsername);
                setTags(finalTags);
              }}
              onFocus={() => setFocusedInput("username")}
              onBlur={() => setFocusedInput(null)}
              selectionColor="#FD297B"
            />
          </View>

          {/* PASSWORD */}
          <View style={[styles.inputContainer, focusedInput === "password" && styles.inputContainerFocused]}>
            <LockIcon />
            <TextInput
              style={styles.textInputWithIcon as TextStyle}
              placeholder="Password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              onFocus={() => setFocusedInput("password")}
              onBlur={() => setFocusedInput(null)}
              selectionColor="#FD297B"
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={goToLogin} style={styles.loginLink}>
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
  },

  gameTitle: {
    top: 20,
    color: "#000",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },

  card: {
    position: "absolute",
    width: "85%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 10,
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#FD297B",
    marginBottom: 20,
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    marginBottom: 15,
    paddingHorizontal: 10,
  },

  inputContainerFocused: {
    borderColor: "#FD297B",
    borderWidth: 2,
  },

  textInputWithIcon: {
    flex: 1,
    height: 50,
    borderWidth: 0,
    ...(Platform.OS === "ios" ||
    Platform.OS === "android" ||
    Platform.OS === "web") && {
      outlineStyle: "none",
    },
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
    textAlign: "center",
  },
});