import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosInstance from "../axiosConfig"; // Import the configured Axios instance

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.post("/api/login", {
        email,
        password,
      });

      // Validate response
      if (res.data.status === 200) {
        await AsyncStorage.setItem("userToken", res.data.token);
        await AsyncStorage.setItem("user", JSON.stringify(res.data.user));
        navigation.navigate("Home");
      } else {
        // Handle non-200 status codes
        console.log("Unexpected status code:", res.status);
        Alert.alert(
          "Login Error",
          "An error occurred during login. Please try again."
        );
      }
    } catch (error) {
      console.error("Error during login:", error);
      if (error.response && error.response.status === 401) {
        Alert.alert("Login failed", "Incorrect username or password.");
      } else {
        Alert.alert(
          "Login Error",
          "An error occurred during login. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <View style={styles.icon}></View>
      </View>
      <Text style={styles.title}>
        Ashley{"\n"}
        <Text style={styles.pinkText}>Meals{"\n"}</Text>
        here!
      </Text>
      <Text style={styles.subtitle}>Lapor makanan mu, kalo gak mau lapar!</Text>
      <TextInput
        style={[styles.input, styles.textInput]}
        placeholder="Email"
        placeholderTextColor="#CCCCCC"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={[styles.input, styles.textInput]}
        placeholder="Password"
        placeholderTextColor="#CCCCCC"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity
        style={[styles.button, styles.signInButton]}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Signing In..." : "Sign In"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#4A00E0",
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    marginTop: "-30%",
    alignItems: "center",
  },
  icon: {
    marginTop: "10%",
    width: 80,
    height: 80,
    backgroundColor: "#00E0FF",
    borderRadius: 50,
    marginLeft: 120,
  },
  title: {
    fontSize: 80,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "left",
    width: "80%",
    lineHeight: 80,
    marginBottom: 10,
  },
  pinkText: {
    color: "#FF00FF",
  },
  subtitle: {
    fontSize: 16,
    color: "#FF00FF",
    textAlign: "center",
    marginBottom: 40,
  },
  button: {
    width: 280,
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: "center",
    marginBottom: 10,
  },
  signInButton: {
    backgroundColor: "#FF00FF",
    borderWidth: 1,
    borderColor: "#FFFFFF",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
  },
  input: {
    width: "80%",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    fontSize: 16,
    marginBottom: 20,
    color: "#000000",
  },
  textInput: {
    borderWidth: 1,
    backgroundColor: "transparent",
    borderColor: "#FFFFFF",
    color: "#FFFFFF",
    width: 280,
    paddingVertical: 10,
    borderRadius: 20,
  },
});
