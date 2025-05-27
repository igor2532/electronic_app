import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './navigation/AppNavigator';
import { AppContextProvider } from './navigation/Context'; // путь укажи правильно
export default function App() {
  return (
     <AppContextProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
      </AppContextProvider>
     );
}
