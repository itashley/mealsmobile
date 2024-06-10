import React, { useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import axiosInstance from '../axiosConfig'; 
import { View, Text, StyleSheet, Pressable, ImageBackground, ScrollView, ActivityIndicator } from 'react-native';
import BG from '../assets/bg/bg.jpg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Moment from 'moment';


export default function HistoryListScreen({ navigation }) {
  const [listOrder, setListOrder] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userID, setUserID] = useState();
  const [hotelID, setHotelID] = useState();

  const getHistoryOrder = async (hotelID) => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`/api/list/orders/${hotelID}`);
      setListOrder(res.data.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
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
            getHistoryOrder(user.hotel_id);
          } else {
            console.error('User data not found in AsyncStorage');
            setLoading(true); // Set loading to false if user data is not found
          }
        } catch (error) {
          console.error('Error fetching user data from AsyncStorage:', error);
          setLoading(true); // Set loading to false if there's an error
        }
      };
  
      fetchUser();
      
      return () => {
        console.log('Screen Unfocused');
      };
    }, [])
  );

  const handleDetailOrder = async (orderDate) => {
    setLoading(true);
    navigation.navigate('Detail Order', { orderDate });
  };

  return (
    <ImageBackground source={BG} style={styles.background} resizeMode="cover">
      <View style={styles.safeArea}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        ) : (
          <View style={styles.container}>
            {listOrder.length === 0 ? (
              <Text style={styles.noRecordsText}>No Records Available</Text>
            ) : (
              <ScrollView contentContainerStyle={styles.scrollViewContent}>
                {listOrder.map(order => (
                  <Pressable key={order.id_order} style={styles.orderContainer} onPress={() => handleDetailOrder(order.order_date)}>
                    <Text style={styles.orderText}>Order ID: {order.id_order}</Text>
                    <Text style={styles.orderDate}>Date: {Moment(order.order_date).format('LL')}</Text>
                  </Pressable>
                ))}
              </ScrollView>
            )}
          </View>
        )}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
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
  noRecordsText: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    fontSize: 18,
    marginTop: '50%',
    color: '#000000',
  },
  orderContainer: {
    marginBottom: 20,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#7ceadd',
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 4 },
    shadowOpacity: 0.55,
    shadowRadius: 0.84,
    elevation: 5,
  },
  orderText: {
    fontSize: 12,
    marginBottom: 5,
  },
  orderDate: {
    fontSize: 22,
    marginBottom: 5,
  },
});
