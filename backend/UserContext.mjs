import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useEffect, useState } from 'react';

export const UserContext = createContext({
  userToken: null,
  setUserToken: (_token) => {}
});

export const UserProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);

  useEffect(() => {
    AsyncStorage.getItem('userToken').then(token => {
      setUserToken(token);
    });
  }, []);

  return (
    <UserContext.Provider value={{ userToken, setUserToken }}>
      {children}
    </UserContext.Provider>
  );
};