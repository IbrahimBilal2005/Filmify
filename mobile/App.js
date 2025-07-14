import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabNavigator from './navigation/TabNavigator';
import MovieDetailsScreen from './screens/MovieDetailsScreen'; // placeholder

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* Tab-based navigation as the main entry point */}
        <Stack.Screen name="MainTabs" component={TabNavigator} />

        {/* Detail screen on top of tabs */}
        <Stack.Screen name="MovieDetails" component={MovieDetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
