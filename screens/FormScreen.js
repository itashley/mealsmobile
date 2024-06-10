import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosConfig';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ImageBackground, ScrollView, ActivityIndicator } from 'react-native';
import BG from '../assets/bg/bg.jpg';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function FormScreen({ navigation }) {
  const [departments, setDepartments] = useState([]);
  const [inputValues, setInputValues] = useState({});
  const [loading, setLoading] = useState(false);
  const [dataExists, setDataExists] = useState(false);

  const [userID, setUserID] = useState();
  const [hotelID, setHotelID] = useState();

  // Function to fetch departments from API
  const getDepartments = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/api/list/departments');
      console.log(res.data);
      if (res.data && res.data.frm === 1) {
        // Data already exist
        setDataExists(true);
        setDepartments(res.data.data);
        // Initialize inputValues with existing orders data
        const initialInputValues = {};
        res.data.data.forEach(dept => {
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
        res.data.data.forEach(dept => {
          initialInputValues[dept.id_department] = { morning: '', afternoon: '', evening: '' };
        });
        setInputValues(initialInputValues);
      } else {
        console.log('Error fetching departments');
      }
    } catch (error) {
      console.error('Error fetching departments:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle text input changes
  const handleInputChange = (text, id_department, period) => {
    setInputValues(prevValues => ({
      ...prevValues,
      [id_department]: {
        ...prevValues[id_department],
        [period]: text,
      },
    }));
  };

  // Function to handle form submission
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.post('/api/submit/order', {
        userID,
        hotelID,
        inputValues
      });
      console.log(res.data);
    } catch (error) {
      console.error('Error fetching departments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          const user = JSON.parse(userData);
          setUserID(user.id);
          setHotelID(user.hotel_id);
          getDepartments();
        } else {
          console.error('User data not found in AsyncStorage');
        }
      } catch (error) {
        console.error('Error fetching user data from AsyncStorage:', error);
      }
    };

    fetchUser();
  }, []);

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
                      value={inputValues[dept.id_department]?.morning || ''}
                      onChangeText={text => handleInputChange(text, dept.id_department, 'morning')}
                    />
                  </View>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Afternoon</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="0"
                      keyboardType="numeric"
                      value={inputValues[dept.id_department]?.afternoon || ''}
                      onChangeText={text => handleInputChange(text, dept.id_department, 'afternoon')}
                    />
                  </View>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Evening</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="0"
                      keyboardType="numeric"
                      value={inputValues[dept.id_department]?.evening || ''}
                      onChangeText={text => handleInputChange(text, dept.id_department, 'evening')}
                    />
                  </View>
                </View>
              ))}
            </ScrollView>

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>{loading ? 'Submitting...' : (dataExists ? 'Update' : 'Submit')}</Text>
            </TouchableOpacity>
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
    paddingBottom: 10, // Adjust paddingBottom to accommodate the Submit button
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
    width: 225,
  },
  input: {
    height: 40,
    width: 60,
    borderRadius: 20,
    fontSize: 16,
    textAlign: 'center',
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 2,
  },
  submitButton: {
    position: 'absolute',
    bottom: 6,
    left: 20,
    right: 20,
    backgroundColor: '#FF0000',
    borderRadius: 10,
    paddingVertical: 15,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
