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

//29052025
const [requestItems, setRequestItems] = useState([]);

useEffect(() => {
  (async () => {
    const stored = await AsyncStorage.getItem('requestItems');
    if (stored) {
      try {
        setRequestItems(JSON.parse(stored));
      } catch (e) {
        setRequestItems([]);
      }
    }
  })();
}, []);

const addToRequest = (product) => {
  setRequestItems(prev => {
    const found = prev.find(p => p.id === product.id);
    if (found) {
      return prev.map(p => p.id === product.id ? { ...p, qty: (p.qty || 1) + 1 } : p);
    }
    return [...prev, { ...product, qty: 1 }];
  });
};

const removeFromRequest = (id) => {
  setRequestItems((prev) => prev.filter(p => p.id !== id));
};
//29052025
  
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
requestItems,
setRequestItems,
addToRequest,
removeFromRequest,

    }}>
      {children}
    </MyContext.Provider>
  );
}
