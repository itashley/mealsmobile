import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Function to get the token from AsyncStorage
const getToken = async () => {
  const token = await AsyncStorage.getItem('userToken');
  return token ? `Bearer ${token}` : null;
};

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: 'https://meals.primahotelindonesia.info/',
  headers: {
    'Content-Type': 'application/json', // You can set your desired content-type here
  },
});

// Add a request interceptor to include the token in headers
axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
