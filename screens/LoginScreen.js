import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Image,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosInstance from "../axiosConfig"; // Import the configured Axios instance
import Dialog from "react-native-dialog";
import ERROR from "../assets/icons/error2.png";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");

  const handleSubmit = async () => {
    if (email == "" && password == "") {
      //Alert.alert("Login Failed", "Email and password cannot be empty.");
      setDialogMessage("Email and password cannot be empty.");
      setDialogVisible(true);
    } else if (email == "") {
      setDialogMessage("Email cannot be empty.");
      setDialogVisible(true);
    } else if (password == "") {
      setDialogMessage("Password cannot be empty.");
      setDialogVisible(true);
    } else {
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

          setDialogMessage("An error occurred during login. Please try again.");
          setDialogVisible(true);
        }
      } catch (error) {
        console.error("Error during login:", error);
        if (error.response && error.response.status === 401) {
          setDialogMessage("Incorrect email or password.");
          setDialogVisible(true);
        } else {
          setDialogMessage("An error occurred during login. Please try again.");
          setDialogVisible(true);
        }
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={{
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
      }}
      behavior="padding"
      enabled
    >
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
        <Text style={styles.subtitle}>
          Lapor makanan mu, kalo gak mau lapar!
        </Text>
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

        <Dialog.Container
          visible={dialogVisible}
          contentStyle={styles.dialogContainer}
        >
          <View style={styles.dialogContent}>
            <View style={{ alignItems: "center" }}>
              <Image source={ERROR} style={styles.errIcon} />
            </View>

            <Dialog.Title style={styles.dialogTitle}>Login Failed</Dialog.Title>
            <Dialog.Description style={styles.dialogDescription}>
              {dialogMessage}
            </Dialog.Description>
          </View>

          <View style={styles.buttonContainer}>
            <Dialog.Button
              style={styles.dialogButton}
              label="OK"
              onPress={() => setDialogVisible(false)}
            />
          </View>
        </Dialog.Container>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  container: {
    flex: 1,
    //backgroundColor: "#4A00E0",
    backgroundColor: "#FF7F50",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 0,
  },
  header: {
    marginTop: "-30%",
    alignItems: "center",
  },
  icon: {
    marginTop: "10%",
    width: 80,
    height: 80,
    //backgroundColor: "#00E0FF",
    backgroundColor: "#7ceadd",
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
    //color: "#FF00FF",
    color: "#7ceadd",
  },
  subtitle: {
    fontSize: 16,
    //color: "#FF00FF",
    color: "#7ceadd",
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
    //backgroundColor: "#FF00FF",
    backgroundColor: "#7ceadd",
    borderWidth: 1,
    borderColor: "#FFFFFF",
  },
  buttonText: {
    color: "#000",
    fontSize: 18,
    fontWeight: "bold",
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
  dialogContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 0,
    elevation: 5, // Shadow on Android
    shadowColor: "#000000", // Shadow on iOS
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
  },
  dialogContent: {
    alignItems: "center", // Center items horizontally
    paddingBottom: 0, // Adjust spacing as needed
  },
  errIcon: {
    width: 60,
    height: 60,
    tintColor: "#ff0000",
    marginTop: -8,
    marginRight: 6,
  },
  dialogTitle: {
    fontSize: 26,
    fontWeight: "500",
    marginTop: 8,
    color: "#000", // Example of custom title color
  },
  dialogDescription: {
    fontSize: 16,
    fontWeight: "500",
    color: "#8f8f8f", // Example of custom description color
    textAlign: "center", // Optional: Adjust text alignment
    marginBottom: 10, // Optional: Adjust spacing
  },
  buttonContainer: {},
  dialogButton: {
    backgroundColor: "#C5F9F6",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 60,
    marginTop: 10,
    marginBottom: 20,
    marginLeft: 5,
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },
});
