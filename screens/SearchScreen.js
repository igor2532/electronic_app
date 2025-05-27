import React, { useEffect, useState, useCallback } from 'react';
import { View, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import debounce from 'lodash.debounce';
import { api } from '../utils/api';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';
import Animated, { FadeInUp } from 'react-native-reanimated';

export default function SearchScreen({ navigation }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchProducts = async (text) => {
    if (!text || text.length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const res = await api.get(`/products?search=${text}`);
      setResults(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Обернутый debounced поиск
  const debouncedSearch = useCallback(debounce(searchProducts, 500), []);

  const handleChangeText = (text) => {
    setQuery(text);
    debouncedSearch(text);
  };

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <SearchBar value={query} onChangeText={handleChangeText} />

      {loading && <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />}

      <FlatList
        data={results}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Animated.View entering={FadeInUp}>
            <ProductCard
              product={item}
              onPress={() => navigation.navigate('ProductDetailsScreen', { product: item })}
            />
          </Animated.View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  loader: {
    marginVertical: 20,
  },
});
