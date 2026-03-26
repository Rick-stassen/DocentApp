import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeSession = async (token) => {
  try {
    await AsyncStorage.setItem('userToken', token);
  } catch (e) {
    console.log('Failed to save token', e);
  }
};

export const getSession = async () => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    return token;
  } catch (e) {
    console.log('Failed to fetch token', e);
    return null;
  }
};