import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosConfig";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import BG from "../assets/bg/bg.jpg";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Moment from "moment";

export default function FormScreen({ navigation }) {
  const [departments, setDepartments] = useState([]);
  const [inputValues, setInputValues] = useState({});
  const [loading, setLoading] = useState(false);
  const [dataExists, setDataExists] = useState(false);

  const [userID, setUserID] = useState();
  const [hotelID, setHotelID] = useState();

  // testing API with get method to fetch today's data on a specific hotel
  // const getDepartments = async () => {
  //   setLoading(true);
  //   try {
  //     const res = await axiosInstance.get("/api/list/departments");
  //     console.log("res data: ", res.data);
  //     if (res.data && res.data.frm === 1) {
  //       // Data already exist
  //       setDataExists(true);
  //       setDepartments(res.data.data);
  //       // Initialize inputValues with existing orders data
  //       const initialInputValues = {};
  //       res.data.data.forEach((dept) => {
  //         initialInputValues[dept.id_department] = {
  //           morning: dept.M_amount.toString(),
  //           afternoon: dept.A_amount.toString(),
  //           evening: dept.E_amount.toString(),
  //         };
  //       });
  //       setInputValues(initialInputValues);
  //     } else if (res.data && res.data.frm === 2) {
  //       // Data not input yet
  //       setDataExists(false);
  //       setDepartments(res.data.data);
  //       const initialInputValues = {};
  //       res.data.data.forEach((dept) => {
  //         initialInputValues[dept.id_department] = {
  //           morning: "",
  //           afternoon: "",
  //           evening: "",
  //         };
  //       });
  //       setInputValues(initialInputValues);
  //     } else {
  //       console.log("Error fetching departments");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching departments:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const getDepartments = async () => {
  //   setLoading(true);
  //   try {
  //     const userData = await AsyncStorage.getItem("user");
  //     if (userData) {
  //       const user = JSON.parse(userData);
  //       const idHotel = user.hotel_id;
  //       console.log("hotel id:", idHotel); // Log the hotel ID here
  //       const res = await axiosInstance.post(`/api/list/departments/`);
  //       console.log("res data: ", res.data);
  //       if (res.data && res.data.frm === 1) {
  //         // Data already exists
  //         setDataExists(true);
  //         setDepartments(res.data.data);
  //         // Initialize inputValues with existing orders data
  //         const initialInputValues = {};
  //         res.data.data.forEach((dept) => {
  //           initialInputValues[dept.id_department] = {
  //             morning: dept.M_amount.toString(),
  //             afternoon: dept.A_amount.toString(),
  //             evening: dept.E_amount.toString(),
  //           };
  //         });
  //         setInputValues(initialInputValues);
  //       } else if (res.data && res.data.frm === 2) {
  //         // Data not input yet
  //         setDataExists(false);
  //         setDepartments(res.data.data);
  //         const initialInputValues = {};
  //         res.data.data.forEach((dept) => {
  //           initialInputValues[dept.id_department] = {
  //             morning: "",
  //             afternoon: "",
  //             evening: "",
  //           };
  //         });
  //         setInputValues(initialInputValues);
  //       } else {
  //         console.log("Error fetching departments");
  //       }
  //     } else {
  //       console.error("User data not found in AsyncStorage");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching departments:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // Using getDetailOrder API to fetch today's data on a specific hotel
  const getDepartments = async () => {
    setLoading(true);
    try {
      const userData = await AsyncStorage.getItem("user");

      if (userData) {
        const user = JSON.parse(userData);
        const idHotel = user.hotel_id;
        console.log("hotel id:", idHotel); // Log the hotel ID here

        // Calculate tomorrow's date
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        const orderDate = tomorrow.toISOString().split("T")[0];
        console.log("orderDate : ", orderDate);

        const res = await axiosInstance.get(
          `/api/detail/orders/${idHotel}/${orderDate}`
        );
        console.log("res data: ", res.data);

        if (res.data && res.data.frm === 1) {
          // Data already exists
          setDataExists(true);
          setDepartments(res.data.data);
          // Initialize inputValues with existing orders data
          const initialInputValues = {};
          res.data.data.forEach((dept) => {
            initialInputValues[dept.id_department] = {
              morning: dept.M_amount.toString(),
              afternoon: dept.A_amount.toString(),
              evening: dept.E_amount.toString(),
            };
          });
          setInputValues(initialInputValues);
        } else if (res.data && res.data.frm === 2) {
          // Data not input yet
          setDataExists(false);
          setDepartments(res.data.data);
          const initialInputValues = {};
          res.data.data.forEach((dept) => {
            initialInputValues[dept.id_department] = {
              morning: "",
              afternoon: "",
              evening: "",
            };
          });
          setInputValues(initialInputValues);
        } else {
          console.log("Error fetching departments");
        }
      } else {
        console.error("User data not found in AsyncStorage");
      }
    } catch (error) {
      console.error("Error fetching departments:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle text input changes
  const handleInputChange = (text, id_department, period) => {
    setInputValues((prevValues) => ({
      ...prevValues,
      [id_department]: {
        ...prevValues[id_department],
        [period]: text,
      },
    }));
  };

  const checkTime = () => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinutes = now.getMinutes();
    console.log("current Hour : ", currentHour);
    console.log("current Minutes : ", currentMinutes);

    // Check if the current time is after or equal to 17:00
    if (
      currentHour > 17 ||
      (currentHour === 17 && currentMinutes >= 0) ||
      currentHour < 12
    ) {
      console.log("It is not the correct time (before 12pm or after 17pm)");
      return true;
    } else {
      console.log("You are in the correct time (12.00-17.00)");
      return false;
    }
  };

  // Call the function

  // Function to handle form submission
  const handleSubmit = async () => {
    if (checkTime()) {
      console.log("Checking time...");
      Alert.alert(
        "Submission Unavailable",
        "Order submissions or updates are not allowed after 5:00 PM WIB."
      );
      console.log("submission is not allowed before 12 p.m. or past 5 p.m.");
    } else {
      setLoading(true);
      try {
        const res = await axiosInstance.post("/api/submit/order", {
          userID,
          hotelID,
          inputValues,
        });
        console.log(res.data);
        {
          dataExists
            ? Alert.alert("Update Successful!", "Your order has been updated.")
            : Alert.alert(
                "Submit Successful!",
                "Your order has been recorded."
              );
        }
      } catch (error) {
        console.error("Error fetching departments:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await AsyncStorage.getItem("user");
        if (userData) {
          const user = JSON.parse(userData);
          setUserID(user.id);
          setHotelID(user.hotel_id);
          getDepartments();
        } else {
          console.error("User data not found in AsyncStorage");
        }
      } catch (error) {
        console.error("Error fetching user data from AsyncStorage:", error);
      }
    };

    fetchUser();
  }, []);

  const tomorrow = Moment().add(1, "days");

  return (
    <ImageBackground source={BG} style={styles.background}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      ) : (
        <View style={styles.safeArea}>
          <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
              <Text style={styles.forDate}>
                Order for {tomorrow.format("dddd")}, {tomorrow.format("LL")}.
              </Text>
              <Text style={styles.dateInfo}>
                Please fill this form before 5 p.m. today
              </Text>
              {departments.map((dept, index) => (
                <View key={index} style={styles.formRow}>
                  <Text style={styles.label}>{dept.nm_department}</Text>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Morning</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="0"
                      keyboardType="numeric"
                      value={inputValues[dept.id_department]?.morning || ""}
                      onChangeText={(text) =>
                        handleInputChange(text, dept.id_department, "morning")
                      }
                    />
                  </View>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Afternoon</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="0"
                      keyboardType="numeric"
                      value={inputValues[dept.id_department]?.afternoon || ""}
                      onChangeText={(text) =>
                        handleInputChange(text, dept.id_department, "afternoon")
                      }
                    />
                  </View>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Evening</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="0"
                      keyboardType="numeric"
                      value={inputValues[dept.id_department]?.evening || ""}
                      onChangeText={(text) =>
                        handleInputChange(text, dept.id_department, "evening")
                      }
                    />
                  </View>
                </View>
              ))}
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmit}
              >
                <Text style={styles.submitButtonText}>
                  {loading ? "Submitting..." : dataExists ? "Update" : "Submit"}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      )}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 20,
    fontSize: 18,
    color: "#000000",
  },
  safeArea: {
    flex: 1,
    marginTop: "20%",
  },
  container: {
    flex: 1,
    padding: 20,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 45, // previously 25
  },
  formRow: {
    marginBottom: 20,
  },
  label: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textDecorationLine: "underline", // Add underline
    textDecorationColor: "#000", // Optional: specify underline color
    textDecorationStyle: "solid", // Optional: specify underline style
  },
  inputGroup: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 20,
    width: 225,
  },
  input: {
    height: 40,
    width: 60,
    borderRadius: 20,
    fontSize: 16,
    textAlign: "center",
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 2,
  },
  submitButton: {
    position: "absolute",
    bottom: 6,
    left: 0,
    right: 20,
    backgroundColor: "#FF0000",
    borderRadius: 10,
    paddingVertical: 15,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  forDate: {
    fontSize: 20,
    marginBottom: 3,
    marginTop: 0,
    fontWeight: "bold",
  },
  dateInfo: {
    fontSize: 16,
    marginBottom: 25,
  },
});
