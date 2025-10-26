import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {  createNativeStackNavigator } from '@react-navigation/native-stack';
import Loginscreen from '../Screen/Loginscreen';
import Registerscreen from '../Screen/Registerscreen';
import Home from '../Screen/Home';
const Stack = createNativeStackNavigator();

const  Stacknavigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Register"
        screenOptions={{
          headerShown: false, // Hide header globally
        }}
      >
        <Stack.Screen name="Login" component={Loginscreen} />
        <Stack.Screen name="Register" component={Registerscreen} />
                <Stack.Screen name="Home" component={Home} />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Stacknavigation;
