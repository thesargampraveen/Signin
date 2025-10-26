import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {  createNativeStackNavigator } from '@react-navigation/native-stack';
import Loginscreen from '../Screen/Loginscreen';
import Registerscreen from '../Screen/Registerscreen';
import Home from '../Screen/Home';
import TodoScreen from '../Screen/TodoScreen';
const Stack = createNativeStackNavigator();

const  Stacknavigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Todos"
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
