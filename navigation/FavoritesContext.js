import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const FavoritesContext = createContext({
  favorites: [],
  addFavorite: () => {},
  removeFavorite: () => {},
  isFavorite: () => false,
});

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    (async () => {
      const data = await AsyncStorage.getItem('favorites');
      if (data) setFavorites(JSON.parse(data));
    })();
  }, []);

  const saveFavorites = async (list) => {
    setFavorites(list);
    await AsyncStorage.setItem('favorites', JSON.stringify(list));
  };

  const addFavorite = (product) => {
    if (!favorites.find(item => item.id === product.id)) {
      const newList = [...favorites, product];
      saveFavorites(newList);
    }
  };

  const removeFavorite = (id) => {
    const newList = favorites.filter(item => item.id !== id);
    saveFavorites(newList);
  };

  const isFavorite = (id) => {
    return !!favorites.find(item => item.id === id);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}
