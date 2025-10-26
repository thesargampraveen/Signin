import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {  createNativeStackNavigator } from '@react-navigation/native-stack';
import auth from '@react-native-firebase/auth';
import Loginscreen from '../Screen/Loginscreen';
import Registerscreen from '../Screen/Registerscreen';
import Home from '../Screen/Home';
import TodoScreen from '../Screen/TodoScreen';

const Stack = createNativeStackNavigator();

const  Stacknavigation = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) {
    // You can return a loading screen here if you want
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={user ? "Todos" : "Register"}
        screenOptions={{
          headerShown: false, // Hide header globally
        }}
      >
        <Stack.Screen name="Login" component={Loginscreen} />
        <Stack.Screen name="Register" component={Registerscreen} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Todos" component={TodoScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Stacknavigation;
