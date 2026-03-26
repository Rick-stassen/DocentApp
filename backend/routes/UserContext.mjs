import { createContext, useEffect, useState } from 'react';
import { getSession } from './storage';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);

  useEffect(() => {
    getSession().then(token => setUserToken(token));
  }, []);

  return (
    <UserContext.Provider value={{ userToken, setUserToken }}>
      {children}
    </UserContext.Provider>
  );
};