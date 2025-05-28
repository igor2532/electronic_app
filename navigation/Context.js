import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const MyContext = createContext({
  user: null,          // { user_id, email, ... }
  setUser: () => {},
  logout: () => {},
});

export function AppContextProvider({ children,
  width,
  height,
  isLandscape,
  numColumns,
  ITEM_WIDTH,
  ITEM_MARGIN, }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const userStr = await AsyncStorage.getItem('user');
        if (userStr) {
          const parsed = JSON.parse(userStr);
          setUser(parsed);
        }
      } catch (e) {
        setUser(null);
      }
    })();
  }, []);

  const login = async (userData) => {
    setUser(userData);
    await AsyncStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem('user');
  };

  return (
    <MyContext.Provider value={{
      user,
      setUser: login,
      logout,
      width,
      height,
      isLandscape,
      numColumns,
      ITEM_WIDTH,
      ITEM_MARGIN,
    }}>
      {children}
    </MyContext.Provider>
  );
}
