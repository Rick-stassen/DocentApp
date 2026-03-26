import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeSession = async (token) => {
  await AsyncStorage.setItem('userToken', token);
};

export const getSession = async () => {
  return await AsyncStorage.getItem('userToken');
};