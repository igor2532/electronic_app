import React, { useRef, useEffect } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function SearchBar({ value, onChangeText }) {
  const inputRef = useRef(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      inputRef.current?.focus();
    }, 300);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <Animated.View entering={FadeInDown} style={styles.container}>
      <Ionicons name="search" size={20} color="#888" style={styles.icon} />
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={onChangeText}
        placeholder="Поиск товаров..."
        placeholderTextColor="#999"
        style={styles.input}
        autoCapitalize="none"
        autoCorrect={false}
        clearButtonMode="while-editing"
        returnKeyType="search"
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
});
