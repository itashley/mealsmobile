import React, { useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
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
  Platform,
} from "react-native";
import BG from "../assets/bg/bg.jpg";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Moment from "moment";

import { Ionicons } from "@expo/vector-icons";
//import RNHTMLtoPDF from "react-native-html-to-pdf";
//import { savePDF } from "expo-file-system"; // For Expo managed workflow
import * as Print from "expo-print"; // For Expo managed workflow
import * as MediaLibrary from "expo-media-library";

export default function DetailOrderScreen({ navigation, route }) {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const { orderDate } = route.params;
  const [userID, setUserID] = useState();
  const [hotelID, setHotelID] = useState();
  const [inputValues, setInputValues] = useState({});

  const fetchDataOrder = async (hotelid, orderDate) => {
    setLoading(true);
    try {
      console.log("hotel id:", hotelid);
      console.log("orderDate : ", orderDate);

      const res = await axiosInstance.get(
        `/api/detail/orders/${hotelid}/${orderDate}`
      );

      console.log("res data: ", res.data);

      if (res.data && res.data.data) {
        setDepartments(res.data.data);
        const initialInputValues = {};
        res.data.data.forEach((dept) => {
          initialInputValues[dept.id_order] = {
            M_amount: dept.M_amount.toString(),
            A_amount: dept.A_amount.toString(),
            E_amount: dept.E_amount.toString(),
          };
        });
        setInputValues(initialInputValues);
      } else {
        console.log("No data found for this order");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Side effect code here
    console.log("Component rendered or updated");

    return () => {
      // Cleanup function
      console.log("Component unmounted or effect re-run");
    };
  });

  const handleInputChange = (text, id_order, field) => {
    setInputValues((prevValues) => ({
      ...prevValues,
      [id_order]: {
        ...prevValues[id_order],
        [field]: text,
      },
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const promises = Object.keys(inputValues).map(async (id_order) => {
        const res = await axiosInstance.put(`/api/update/order/${id_order}`, {
          M_amount: inputValues[id_order].M_amount,
          A_amount: inputValues[id_order].A_amount,
          E_amount: inputValues[id_order].E_amount,
        });
        return res.data;
      });
      await Promise.all(promises);
      fetchDataOrder(hotelID, orderDate);
    } catch (error) {
      console.error("Error updating orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      const fetchUser = async () => {
        try {
          const userData = await AsyncStorage.getItem("user");
          if (userData) {
            const user = JSON.parse(userData);
            setUserID(user.id);
            setHotelID(user.hotel_id);
            var hotel = user.hotel_id;
            fetchDataOrder(hotel, orderDate);
          } else {
            console.error("User data not found in AsyncStorage");
            setLoading(true); // Set loading to true if user data is not found
          }
        } catch (error) {
          console.error("Error fetching user data from AsyncStorage:", error);
          setLoading(true); // Set loading to true if there's an error
        }
      };

      fetchUser();

      return () => {
        console.log("Screen Unfocused");
      };
    }, [])
  );

  const downloadAsPDF = async () => {
    try {
      // Generate HTML content for PDF
      let htmlContent = `
        <html>
          <head>
            <style>
              table {
                width: 100%;
                border-collapse: collapse;
              }
              th, td {
                border: 1px solid black;
                padding: 8px;
                text-align: center;
              }
            </style>
          </head>
          <body>
            <h1>Order Details</h1>
            <p>Date: ${Moment(orderDate).format("dddd, LL")}</p>
            <table>
              <thead>
                <tr>
                  <th>Department</th>
                  <th>Morning</th>
                  <th>Afternoon</th>
                  <th>Evening</th>
                </tr>
              </thead>
              <tbody>
                ${departments
                  .map(
                    (dept) => `
                  <tr>
                    <td>${dept.nm_department}</td>
                    <td>${inputValues[dept.id_order]?.M_amount || ""}</td>
                    <td>${inputValues[dept.id_order]?.A_amount || ""}</td>
                    <td>${inputValues[dept.id_order]?.E_amount || ""}</td>
                  </tr>
                `
                  )
                  .join("")}
              </tbody>
            </table>
          </body>
        </html>
      `;

      // For Expo managed workflow
      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      await MediaLibrary.saveToLibraryAsync(uri);
      alert("PDF saved to your device");
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    }
  };

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
            {/* //pdf button
            <TouchableOpacity
              style={styles.downloadButton}
              onPress={downloadAsPDF}
            >
              <Ionicons name="download-outline" size={24} />
            </TouchableOpacity> */}
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
              <Text style={styles.forDate}>
                Date : {Moment(orderDate).format("dddd")},{" "}
                {Moment(orderDate).format("LL")}
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
                      editable={false}
                      value={inputValues[dept.id_order]?.M_amount || "0"}
                      // onChangeText={(text) =>
                      //   handleInputChange(text, dept.id_order, "M_amount")
                      // }
                    />
                  </View>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Afternoon</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="0"
                      keyboardType="numeric"
                      editable={false}
                      value={inputValues[dept.id_order]?.A_amount || "0"}
                      // onChangeText={(text) =>
                      //   handleInputChange(text, dept.id_order, "A_amount")
                      // }
                    />
                  </View>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Evening</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="0"
                      keyboardType="numeric"
                      editable={false}
                      value={inputValues[dept.id_order]?.E_amount || "0"}
                      // onChangeText={(text) =>
                      //   handleInputChange(text, dept.id_order, "E_amount")
                      // }
                    />
                  </View>
                </View>
              ))}
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
    marginTop: "12%",
  },
  container: {
    flex: 1,
    paddingTop: 45,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingLeft: 25,
    paddingBottom: 20,
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
    width: 210,
  },
  input: {
    height: 40,
    width: 80,
    borderRadius: 20,
    fontSize: 16,
    textAlign: "center",
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 2,
    color: "#000",
    backgroundColor: "#fff",
  },
  forDate: {
    fontSize: 20,
    marginBottom: 20,
    marginTop: 10,
    fontWeight: "bold",
  },
});
