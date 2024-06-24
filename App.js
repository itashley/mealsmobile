import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, StatusBar, AppState } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./screens/LoginScreen";
import HomeScreen from "./screens/HomeScreen";
import FormScreen from "./screens/FormScreen";
import HistoryListScreen from "./screens/HistoryListScreen";
import DetailOrderScreen from "./screens/DetailOrderScreen";
import * as ExpoSplashScreen from "expo-splash-screen";

const Stack = createNativeStackNavigator();

// Keep the splash screen visible while fetching resources
ExpoSplashScreen.preventAutoHideAsync();

const AuthLoadingScreen = ({ navigation }) => {
  useEffect(() => {
    const checkToken = async () => {
      try {
        const userToken = await AsyncStorage.getItem("userToken");
        if (userToken) {
          navigation.reset({
            index: 0,
            routes: [{ name: "Home" }],
          });
        } else {
          navigation.reset({
            index: 0,
            routes: [{ name: "Login" }],
          });
        }
      } catch (e) {
        console.error("Failed to load token", e);
      } finally {
        await ExpoSplashScreen.hideAsync();
      }
    };

    checkToken();
  }, [navigation]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" />
    </View>
  );
};

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const prepare = async () => {
      try {
        await ExpoSplashScreen.preventAutoHideAsync();
        setTimeout(() => {
          setIsLoading(false);
        }, 3000); // Show splash screen for 3 seconds
      } catch (e) {
        console.error("Error hiding splash screen", e);
      }
    };

    prepare();
  }, []);

  useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      if (nextAppState === "active") {
        StatusBar.setHidden(false);
      }
    };

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    return () => {
      subscription.remove();
    };
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar
        translucent={true}
        //backgroundColor="#FF7F50"
        backgroundColor="black"
        barStyle="light-content"
      />
      <Stack.Navigator initialRouteName="AuthLoading">
        <Stack.Screen
          name="AuthLoading"
          component={AuthLoadingScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false, headerTransparent: true }}
        />
        <Stack.Screen
          name="Form Order"
          component={FormScreen}
          options={{
            headerTransparent: true,
            headerTitle: "Order Form", // Optionally, you can set an empty header title
          }}
        />
        <Stack.Screen
          name="History Order"
          component={HistoryListScreen}
          options={{
            headerTransparent: true,
            headerTitle: "Order History", // Optionally, you can set an empty header title
          }}
        />
        <Stack.Screen
          name="Detail Order"
          component={DetailOrderScreen}
          options={{
            headerTransparent: true,
            headerTitle: "Order Detail", // Optionally, you can set an empty header title
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
