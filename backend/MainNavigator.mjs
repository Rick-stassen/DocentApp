import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useContext } from 'react';
import { UserContext } from './UserContext';

import HomeScreen from 'D:/Leer Jaar 2/Code/klant opdracht/DocentApp/app/(tabs)/index.tsx';
import LoginScreen from 'D:/Leer Jaar 2/Code/klant opdracht/DocentApp/app/(tabs)/login.tsx';

const Stack = createStackNavigator();

const MainNavigator = () => {
  const { userToken } = useContext(UserContext);

  if(!userToken) {
    console.log('No user token found. User is not logged in.');
  } else {
    console.log('User token found:', userToken);
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {userToken ? (
          <Stack.Screen name="Home" component={HomeScreen} />
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MainNavigator;