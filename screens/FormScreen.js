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
  BackHandler,
  Image,
  StatusBar,
  KeyboardAvoidingView,
} from "react-native";
import BG from "../assets/bg/bg.jpg";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Moment from "moment";
import Dialog from "react-native-dialog";
import DENY from "../assets/icons/denied.png";
import CHECK from "../assets/icons/check.png";

export default function FormScreen({ navigation }) {
  const [departments, setDepartments] = useState([]);
  const [inputValues, setInputValues] = useState({});
  const [loading, setLoading] = useState(false);
  const [dataExists, setDataExists] = useState(false);
  const [total, setTotal] = useState(0);
  const [placeholders, setPlaceholders] = useState({});

  const [userID, setUserID] = useState();
  const [hotelID, setHotelID] = useState();
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [dialogTitle, setDialogTitle] = useState("");

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
        console.log("today : ", today);
        const tomorrow = new Date(today);

        tomorrow.setDate(today.getDate() + 1);
        console.log("tomorrow : ", tomorrow);

        const localDate = new Date(
          tomorrow.getTime() - tomorrow.getTimezoneOffset() * 60000
        );
        console.log("localdate : ", localDate);
        const orderDate = localDate.toISOString().split("T")[0];
        console.log("orderDate ini : ", orderDate);

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
          calculateTotal();
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

  const handleInputFocus = (id_department, period) => {
    console.log("onfocus works");
    setPlaceholders((prevPlaceholders) => ({
      ...prevPlaceholders,
      [`${id_department}_${period}`]: "",
    }));
    setInputValues((prevValues) => {
      const currentValue = prevValues[id_department][period];
      if (currentValue === "0") {
        return {
          ...prevValues,
          [id_department]: {
            ...prevValues[id_department],
            [period]: "",
          },
        };
      }
      return prevValues;
    });
  };

  const handleInputBlur = (id_department, period) => {
    if (!inputValues[id_department][period]) {
      setPlaceholders((prevPlaceholders) => ({
        ...prevPlaceholders,
        [`${id_department}_${period}`]: "0",
      }));
    }
  };

  const calculateTotal = () => {
    let sum = 0;

    // Iterate over departments
    departments.forEach((dept) => {
      const deptValues = inputValues[dept.id_department];
      console.log("dV morning : ", deptValues.morning);
      // Check if deptValues exists and has valid numeric values
      if (
        deptValues
        // &&
        // !isNaN(deptValues.morning) &&
        // !isNaN(deptValues.afternoon) &&
        // !isNaN(deptValues.evening)
      ) {
        // Calculate sum for current department
        sum +=
          Number(deptValues.morning) +
          Number(deptValues.afternoon) +
          Number(deptValues.evening);
      }
    });

    // Update the total state
    setTotal(sum);
    console.log("total dari calculate : ", total);
  };

  const checkTime = () => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinutes = now.getMinutes();
    console.log("current Hour : ", currentHour);
    console.log("current Minutes : ", currentMinutes);

    // Check if the current time is after or equal to 17:00
    // supposed to be currentHour > 17 || (currentHour === 17 && currentMinutes >= 0) || currentHour < 12
    if (
      currentHour > 17 ||
      (currentHour === 17 && currentMinutes >= 0) ||
      currentHour < 12
    ) {
      console.log("It is not the correct time (before 12pm or after 17pm)");
      return true; //supposed to be true
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
      // Alert.alert(
      //   "Submission Unavailable",
      //   "Order submissions or updates are not allowed after 5:00 PM WIB."
      // );
      setDialogTitle("Submission Unavailable");
      setDialogMessage(
        "Order submissions or updates are not allowed after 17:00 PM WIB."
      );
      setDialogVisible(true);

      console.log("submission is not allowed before 12 p.m. or past 5 p.m.");
    } else {
      setLoading(true);
      try {
        const res = await axiosInstance.post("/api/submit/order", {
          userID,
          hotelID,
          inputValues,
        });

        if (res.data) {
          if (dataExists) {
            setDialogTitle("Update Successful!");
            setDialogMessage("Your orders has been updated.");
          } else {
            setDialogTitle("Submit Successful!");
            setDialogMessage("Your orders has been recorded.");
          }
          setDialogVisible(true);
        } else {
          console.log("Response data is empty or falsy.");
        }
      } catch (error) {
        console.error("Error submitting order:", error);
      } finally {
        getDepartments();
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
          console.log("userID : ", user.id);
          console.log("userHID : ", user.hotel_id);
          console.log("dept inputV : ", inputValues);
        } else {
          console.error("User data not found in AsyncStorage");
        }
      } catch (error) {
        console.error("Error fetching user data from AsyncStorage:", error);
      }
    };

    fetchUser();

    const backAction = () => {
      navigation.navigate("Home");
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    calculateTotal(inputValues);
  }, [inputValues]);

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
          <KeyboardAvoidingView
            style={{
              paddingTop: 45,
              flex: 1,
              flexDirection: "column",
              justifyContent: "center",
            }}
            behavior="padding"
            enabled
          >
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
                      placeholder={
                        placeholders[`${dept.id_department}_morning`] ||
                        (dataExists ? "" : "0")
                      }
                      multiline={true}
                      keyboardType="numeric"
                      value={inputValues[dept.id_department]?.morning || ""}
                      onChangeText={(text) =>
                        handleInputChange(text, dept.id_department, "morning")
                      }
                      onFocus={() =>
                        handleInputFocus(dept.id_department, "morning")
                      }
                      onBlur={() =>
                        handleInputBlur(dept.id_department, "morning")
                      }
                    />
                  </View>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Afternoon</Text>
                    <TextInput
                      style={styles.input}
                      placeholder={
                        placeholders[`${dept.id_department}_afternoon`] ||
                        (dataExists ? "" : "0")
                      }
                      multiline={true}
                      keyboardType="numeric"
                      value={inputValues[dept.id_department]?.afternoon || ""}
                      onChangeText={(text) =>
                        handleInputChange(text, dept.id_department, "afternoon")
                      }
                      onFocus={() =>
                        handleInputFocus(dept.id_department, "afternoon")
                      }
                      onBlur={() =>
                        handleInputBlur(dept.id_department, "afternoon")
                      }
                    />
                  </View>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Evening</Text>
                    <TextInput
                      style={styles.input}
                      placeholder={
                        placeholders[`${dept.id_department}_evening`] ||
                        (dataExists ? "" : "0")
                      }
                      multiline={true}
                      keyboardType="numeric"
                      value={inputValues[dept.id_department]?.evening || ""}
                      onChangeText={(text) =>
                        handleInputChange(text, dept.id_department, "evening")
                      }
                      onFocus={() =>
                        handleInputFocus(dept.id_department, "evening")
                      }
                      onBlur={() =>
                        handleInputBlur(dept.id_department, "evening")
                      }
                    />
                  </View>
                </View>
              ))}
              <View style={styles.inputGroupTotal}>
                <Text style={styles.inputLabelTotal}>Total</Text>
                <TextInput
                  style={styles.inputTotal}
                  placeholder="0"
                  keyboardType="numeric"
                  value={total.toString()}
                  editable={false}
                />
              </View>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmit}
              >
                <Text style={styles.submitButtonText}>
                  {loading ? "Submitting..." : dataExists ? "Update" : "Submit"}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </KeyboardAvoidingView>
          <Dialog.Container
            visible={dialogVisible}
            contentStyle={styles.dialogContainer}
          >
            <View style={styles.dialogContent}>
              <View style={{ alignItems: "center" }}>
                {dialogTitle === "Submission Unavailable" ? (
                  <Image source={DENY} style={styles.errIcon} />
                ) : (
                  <Image source={CHECK} style={styles.checkIcon} />
                )}
              </View>

              <Dialog.Title style={styles.dialogTitle}>
                {dialogTitle}
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
    marginTop: "12%",
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingLeft: 25,
    paddingBottom: 85, // previously 25
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
  inputGroupTotal: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 40,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 20,
    width: 225,
  },
  inputLabelTotal: {
    fontSize: 20,
    fontWeight: "bold",
    marginRight: 20,
    width: 225,
    textDecorationLine: "underline", // Add underline
    textDecorationColor: "#000", // Optional: specify underline color
    textDecorationStyle: "solid", // Optional: specify underline style
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
    color: "#000",
  },
  inputTotal: {
    height: 40,
    width: 60,
    borderRadius: 20,
    fontSize: 16,
    textAlign: "center",
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 2,
    color: "#000",
    backgroundColor: "#fff",
  },
  submitButton: {
    position: "absolute",
    bottom: 35,
    left: 22,
    right: 22,
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
    marginTop: 10,
    fontWeight: "bold",
  },
  dateInfo: {
    fontSize: 16,
    marginBottom: 25,
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
  checkIcon: {
    width: 60,
    height: 60,
    tintColor: "green",
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
