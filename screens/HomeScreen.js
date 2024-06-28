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
  BackHandler,
  StatusBar,
} from "react-native";
//import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ORDERIMG from "../assets/icons/order3.png";
import HISTORYIMG from "../assets/icons/list2.png";
import BG from "../assets/bg/bg.jpg";
import LOVE from "../assets/icons/heart.png";
import Dialog from "react-native-dialog";
import DENY from "../assets/icons/denied.png";

export default function HomeScreen({ navigation }) {
  const handleLogout = async () => {
    await AsyncStorage.removeItem("userToken");
    await AsyncStorage.removeItem("user");
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  };

  const [hotelName, setHotelName] = useState("ASHLEY");
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await AsyncStorage.getItem("user");

      if (userData) {
        const user = JSON.parse(userData);
        setHotelName(user.nm_hotel);
      }
    };

    fetchUser();

    const backAction = () => {
      BackHandler.exitApp();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  const handleOrderPress = () => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinutes = now.getMinutes();
    console.log("current Hour : ", currentHour);
    console.log("current Minutes : ", currentMinutes);

    // supposed to be currentHour >= 12 && currentHour < 17
    if (currentHour >= 12 && currentHour < 17) {
      console.log("You are in the correct time (12.00-17.00)");
      navigation.navigate("Form Order");
    } else {
      console.log("It is not the correct time (before 12pm");
      // Alert.alert(
      //   "Orders Unavailable",
      //   "Orders can only be placed between 12:00 PM and 5:00 PM. Please try again during this time."
      // );
      setDialogMessage(
        "Orders can only be placed between 12:00 PM and 17:00 PM. Please try again during this time."
      );
      setDialogVisible(true);
    }
  };

  const handleHistoryPress = () => {
    navigation.navigate("History Order");
  };

  return (
    <ImageBackground source={BG} style={styles.background} resizeMode="cover">
      <StatusBar backgroundColor="#000000" barStyle="light-content" />
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

        <View style={styles.createdWrapper}>
          <Text style={styles.createdBy}>Created by IT AHG</Text>
          <Image source={LOVE} style={styles.loveIcon} />
        </View>

        <Dialog.Container
          visible={dialogVisible}
          contentStyle={styles.dialogContainer}
        >
          <View style={styles.dialogContent}>
            <View style={{ alignItems: "center" }}>
              <Image source={DENY} style={styles.errIcon} />
            </View>

            <Dialog.Title style={styles.dialogTitle}>
              Orders Unavailable
            </Dialog.Title>
            <View style={styles.descContainer}>
              <Dialog.Description style={styles.dialogDescription}>
                {dialogMessage}
              </Dialog.Description>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <Dialog.Button
              style={styles.dialogButton}
              label="OK"
              onPress={() => setDialogVisible(false)}
            />
          </View>
        </Dialog.Container>
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
    marginTop: "-12%",
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
  createdWrapper: {
    position: "absolute",
    bottom: 50,
    flex: 1,
    flexDirection: "row",
  },
  createdBy: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FF7F50",
    //color: "#8f8f8f",
  },
  loveIcon: {
    width: 10,
    height: 10,
    marginTop: 4,
    marginLeft: 4,
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
    marginHorizontal: 10,
  },
  descContainer: {
    paddingHorizontal: 30,
    marginBottom: 8,
  },
  dialogDescription: {
    fontSize: 16,
    fontWeight: "500",
    color: "#8f8f8f", // Example of custom description color
    textAlign: "center", // Optional: Adjust text alignment
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
