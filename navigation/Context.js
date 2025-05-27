import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const MyContext = createContext({
  user: null,          // { user_id, email, ... }
  setUser: () => {},
  logout: () => {},
});

export function AppContextProvider({ children }) {
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
    <MyContext.Provider value={{ user, setUser: login, logout }}>
      {children}
    </MyContext.Provider>
  );
}
