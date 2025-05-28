import React, { useEffect, useState, useCallback, useRef } from 'react';
import { View, FlatList, ActivityIndicator, StyleSheet, Text, TouchableOpacity, TextInput, Keyboard, Dimensions } from 'react-native';
import debounce from 'lodash.debounce';
import { api } from '../utils/api';
import ProductCard from '../components/ProductCard';
import Animated, { FadeInUp } from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const screenWidth = Dimensions.get('window').width;
const ITEM_MARGIN = 12;
const ITEM_WIDTH = (screenWidth - 3 * ITEM_MARGIN) / 2;

const STORAGE_KEY = 'search_history_v1';

export default function SearchScreen({ navigation }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [inputFocused, setInputFocused] = useState(true);
  const inputRef = useRef();

  // Скрыть стандартный header при поиске
  useEffect(() => {
    navigation.setOptions({ headerShown: false });
    return () => navigation.setOptions({ headerShown: true });
  }, [navigation]);

  useEffect(() => {
    loadHistory();
    setTimeout(() => inputRef.current?.focus(), 300); // автофокус
  }, []);

  // Загрузка истории из AsyncStorage
  const loadHistory = async () => {
    const str = await AsyncStorage.getItem(STORAGE_KEY);
    setHistory(str ? JSON.parse(str) : []);
  };

  // Сохраняем новый запрос в начало истории
  const saveToHistory = async (text) => {
    if (!text || text.length < 2) return;
    let newHistory = [text, ...history.filter(q => q !== text)].slice(0, 12);
    setHistory(newHistory);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
  };

  const clearHistory = async () => {
    setHistory([]);
    await AsyncStorage.removeItem(STORAGE_KEY);
  };

  const removeFromHistory = async (item) => {
    const newHistory = history.filter(q => q !== item);
    setHistory(newHistory);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
  };

  // Поиск по товарам
  const searchProducts = async (text) => {
    if (!text || text.length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const res = await api.get(`/products?search=${text}`);
      setResults(res.data);
      await saveToHistory(text);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = useCallback(debounce(searchProducts, 400), [history]);

  const handleChangeText = (text) => {
    setQuery(text);
    debouncedSearch(text);
  };

  // Кнопка "Отмена"
  const handleCancel = () => {
    navigation.goBack();
  };

  // Клик по запросу из истории
  const handleHistorySearch = (text) => {
    setQuery(text);
    searchProducts(text);
    inputRef.current?.blur();
  };

  const renderProduct = ({ item }) => (
    <Animated.View entering={FadeInUp} style={styles.productWrap}>
      <ProductCard
        product={item}
        onPress={() => navigation.navigate('ProductDetailsScreen', { product: item })}
        style={styles.productCardCustom}
      />
    </Animated.View>
  );

  return (
    <View style={styles.root}>
      {/* Строка поиска как у OZON */}
      <View style={styles.searchRow}>
        <Ionicons name="search" size={22} color="#999" style={{ marginLeft: 8 }} />
        <TextInput
          ref={inputRef}
          style={styles.searchInput}
          value={query}
          onChangeText={handleChangeText}
          placeholder="Поиск товаров…"
          placeholderTextColor="#888"
          onFocus={() => setInputFocused(true)}
          onBlur={() => setInputFocused(false)}
          returnKeyType="search"
          onSubmitEditing={() => {
            Keyboard.dismiss();
            searchProducts(query);
          }}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery('')}>
            <Ionicons name="close-circle" size={20} color="#888" style={{ marginRight: 6 }} />
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={handleCancel} style={{ marginRight: 8 }}>
          <Text style={styles.cancelBtn}>Отмена</Text>
        </TouchableOpacity>
      </View>

      {/* История поиска */}
      {(!query || results.length === 0) && history.length > 0 && (
        <View style={styles.historyBlock}>
          <View style={styles.historyHeader}>
            <Text style={styles.historyTitle}>ИСТОРИЯ</Text>
            <TouchableOpacity onPress={clearHistory}>
              <Text style={styles.historyClear}>Очистить</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.historyList}>
            {history.map((item, idx) => (
              <View key={item + idx} style={styles.historyItemWrap}>
                <TouchableOpacity onPress={() => handleHistorySearch(item)} style={styles.historyItemBtn}>
                  <Text style={styles.historyItemText}>{item}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => removeFromHistory(item)}>
                  <Ionicons name="close" size={17} color="#aaa" style={{ marginLeft: 4 }} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Результаты поиска */}
      {loading && <ActivityIndicator size="large" color="#1E90FF" style={styles.loader} />}
      <FlatList
        data={results}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderProduct}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={null}
      />
    </View>
  );
}

const DARK_BG = '#191B22';
const DARK_CARD = '#23262F';

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: DARK_BG, paddingHorizontal: 11 },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#23262F',
    borderRadius: 15,
    margin: 12,
    marginTop: 35,
    marginBottom: 7,
    paddingLeft: 6,
    paddingVertical: 3,
    paddingRight: 4,
    minHeight: 42,
  },
  searchInput: {
    flex: 1,
    backgroundColor: 'transparent',
    color: '#fff',
    fontSize: 18,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  cancelBtn: {
    color: '#1E90FF',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 2,
  },
  loader: { marginVertical: 20 },
  listContainer: { paddingHorizontal: ITEM_MARGIN, paddingBottom: 80, backgroundColor: DARK_BG },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: ITEM_MARGIN },
  productWrap: { width: ITEM_WIDTH, marginRight: ITEM_MARGIN, marginBottom: ITEM_MARGIN, backgroundColor: 'transparent' },
  productCardCustom: { backgroundColor: DARK_CARD, borderRadius: 16, overflow: 'hidden' },

  historyBlock: {
    marginTop: 15,
    marginHorizontal: 14,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  historyTitle: { color: '#666', fontWeight: 'bold', fontSize: 15, letterSpacing: 1 },
  historyClear: { color: '#1E90FF', fontWeight: 'bold', fontSize: 15 },
  historyList: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  historyItemWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#23262F',
    borderRadius: 17,
    paddingVertical: 7,
    paddingHorizontal: 13,
    marginRight: 8,
    marginBottom: 8,
  },
  historyItemBtn: { marginRight: 5 },
  historyItemText: { color: '#fff', fontSize: 16 },
});
