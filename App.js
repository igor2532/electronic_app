import React, { useMemo } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './navigation/AppNavigator';
import { AppContextProvider } from './navigation/Context'; 
import { FavoritesProvider } from './navigation/FavoritesContext';
import { useWindowDimensions } from 'react-native';
const ITEM_MARGIN = 12; 
export default function App() {
  
   const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const numColumns = isLandscape ? 3 : 2;
  const ITEM_WIDTH = (width - (numColumns + 1) * ITEM_MARGIN) / numColumns;
   const contextValue = useMemo(() => ({  
    width,
    height,
    isLandscape,
    numColumns,
    ITEM_WIDTH,
    ITEM_MARGIN,
    // ... другие данные контекста
  }), [width, height, isLandscape, numColumns, ITEM_WIDTH, ITEM_MARGIN]);
  return (
    <FavoritesProvider>
     <AppContextProvider width={width}
        height={height}
        isLandscape={isLandscape}
        numColumns={numColumns}
        ITEM_WIDTH={ITEM_WIDTH}
        ITEM_MARGIN={ITEM_MARGIN}>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
      </AppContextProvider>
      </FavoritesProvider>
      
     );
}
