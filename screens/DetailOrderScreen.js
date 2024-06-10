import React, { useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import axiosInstance from '../axiosConfig'; 
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ImageBackground, ScrollView, ActivityIndicator } from 'react-native';
import BG from '../assets/bg/bg.jpg';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
      const res = await axiosInstance.get(`/api/detail/orders/${hotelid}/${orderDate}`);
      if (res.data && res.data.data) {
        setDepartments(res.data.data);
        const initialInputValues = {};
        res.data.data.forEach(dept => {
          initialInputValues[dept.id_order] = {
            M_amount: dept.M_amount.toString(),
            A_amount: dept.A_amount.toString(),
            E_amount: dept.E_amount.toString(),
          };
        });
        setInputValues(initialInputValues);
      } else {
        console.log('No data found for this order');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Side effect code here
    console.log('Component rendered or updated');
  
    return () => {
      // Cleanup function
      console.log('Component unmounted or effect re-run');
    };
  }, );

  const handleInputChange = (text, id_order, field) => {
    setInputValues(prevValues => ({
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
      const promises = Object.keys(inputValues).map(async id_order => {
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
      console.error('Error updating orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
     
      const fetchUser = async () => {
        try {
          const userData = await AsyncStorage.getItem('user');
          if (userData) {
            const user = JSON.parse(userData);
            setUserID(user.id);
            setHotelID(user.hotel_id);
            var hotel = user.hotel_id;
            fetchDataOrder(hotel, orderDate);
          } else {
            console.error('User data not found in AsyncStorage');
            setLoading(true); // Set loading to true if user data is not found
          }
        } catch (error) {
          console.error('Error fetching user data from AsyncStorage:', error);
          setLoading(true); // Set loading to true if there's an error
        }
      };
  
      fetchUser();

      return () => {
        console.log('Screen Unfocused');
      };
    }, [])
  );

  return (
    <ImageBackground source={BG} style={styles.background}>
      {loading ? 
         <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      : 
        <View style={styles.safeArea}>
          <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
              {departments.map((dept, index) => (
                <View key={index} style={styles.formRow}>
                  <Text style={styles.label}>{dept.nm_department}</Text>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Morning</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="0"
                      keyboardType="numeric"
                      value={inputValues[dept.id_order]?.M_amount || '0'}
                      onChangeText={text => handleInputChange(text, dept.id_order, 'M_amount')}
                    />
                  </View>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Afternoon</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="0"
                      keyboardType="numeric"
                      value={inputValues[dept.id_order]?.A_amount || '0'}
                      onChangeText={text => handleInputChange(text, dept.id_order, 'A_amount')}
                    />
                  </View>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Evening</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="0"
                      keyboardType="numeric"
                      value={inputValues[dept.id_order]?.E_amount || '0'}
                      onChangeText={text => handleInputChange(text, dept.id_order, 'E_amount')}
                    />
                  </View>
                </View>
              ))}
            </ScrollView>

           
          </View>
        </View>
      }
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 18,
    color: '#000000',
  },
  safeArea: {
    flex: 1,
    marginTop: '20%',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 100, // Adjust paddingBottom to accommodate the Submit button
  },
  formRow: {
    marginBottom: 20,
  },
  label: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 20,
    width: 210,
  },
  input: {
    height: 40,
    width: 80,
    borderRadius: 20,
    fontSize: 16,
    textAlign: 'center',
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 2,
  },
  
});
