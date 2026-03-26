import React from 'react';
import MainNavigator from './MainNavigator';
import { UserProvider } from './UserContext';

export default function App() {
  return (
    <UserProvider>
      <MainNavigator />
    </UserProvider>
  );
}