import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  SafeAreaView,
  ImageBackground,
  Image,
  Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ORDERIMG from "../assets/icons/order2.png";
import HISTORYIMG from "../assets/icons/list.png";
import BG from "../assets/bg/bg.jpg";

export default function HomeScreen({ navigation }) {
  const handleLogout = async () => {
    await AsyncStorage.removeItem("userToken");
    navigation.navigate("Login");
  };

  const [hotelName, setHoteName] = useState("ASHLEY");

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await AsyncStorage.getItem("user");

      if (userData) {
        const user = JSON.parse(userData);
        setHoteName(user.nm_hotel);
      }
    };

    fetchUser();
  }, []);

  const handleOrderPress = () => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinutes = now.getMinutes();
    console.log("current Hour : ", currentHour);
    console.log("current Minutes : ", currentMinutes);

    // supposed to be currentHour > 12 && currentHour < 17
    if (currentHour > 12 && currentHour < 17) {
      console.log("You are in the correct time (12.00-17.00)");
      navigation.navigate("Form Order");
    } else {
      console.log("It is not the correct time (before 12pm");
      Alert.alert(
        "Orders Unavailable",
        "Orders can only be placed between 12:00 PM and 5:00 PM. Please try again during this time."
      );
    }
  };

  const handleHistoryPress = () => {
    navigation.navigate("History Order");
  };

  return (
    <ImageBackground source={BG} style={styles.background} resizeMode="cover">
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>MEALS</Text>
        <Text style={styles.pinkText}>ORDER</Text>
        <Text style={styles.subtitle}>{hotelName}</Text>

        <View style={styles.menuContainer}>
          <Pressable style={styles.menuItem} onPress={handleOrderPress}>
            <Image source={ORDERIMG} style={styles.image} />
            <Text style={styles.menuItemText}>Order</Text>
          </Pressable>

          <Pressable style={styles.menuItem} onPress={handleHistoryPress}>
            <Image source={HISTORYIMG} style={styles.image} />
            <Text style={styles.menuItemText}>History</Text>
          </Pressable>
        </View>

        <Pressable style={styles.orderButton} onPress={handleLogout}>
          <Text style={styles.orderButtonText}>Sign Out</Text>
        </Pressable>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    // backgroundColor: 'rgba(255, 255, 255, 0.5)', // Semi-transparent white background
    padding: 20,
    marginTop: "-20%",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 60,
    fontWeight: "900",
    color: "#4A00E0",
    textAlign: "center",
    width: "100%",
    lineHeight: 60,
    marginLeft: -80,
  },
  pinkText: {
    color: "#FF00FF",
    fontSize: 70,
    fontWeight: "900",
    marginLeft: 80,
    textAlign: "center",
    width: "100%",
    lineHeight: 70,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FF7F50",
    marginBottom: 10,
  },
  menuContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 10,
  },
  menuItem: {
    backgroundColor: "#FF7F50",
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    width: 320,
    height: 160,
    flexDirection: "row", // Added to align items horizontally
    alignItems: "center", // Added to align items vertically
  },
  image: {
    width: 180,
    height: 180,
    position: "absolute",
  },
  menuItemText: {
    fontSize: 60,
    fontWeight: "bold",
    color: "#7ceadd",
    textShadow: "#f46eee",
    textShadowOffset: { width: 3, height: 2 },
    textShadowRadius: 2,
    position: "absolute",
    bottom: 1,
    right: 20,
    textAlign: "right",
    zIndex: 0, // Ensures text is behind image
  },
  orderButton: {
    backgroundColor: "#FF0000",
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 40,
    marginTop: 10,
    width: 320,
  },
  orderButtonText: {
    color: "#FFFFFF",
    fontSize: 22,
    textAlign: "center",
    fontWeight: "bold",
  },
});
