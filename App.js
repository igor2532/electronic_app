import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './navigation/AppNavigator';
import { AppContextProvider } from './navigation/Context'; 
import { FavoritesProvider } from './navigation/FavoritesContext';
export default function App() {
  return (
    <FavoritesProvider>
     <AppContextProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
      </AppContextProvider>
      </FavoritesProvider>
     );
}
