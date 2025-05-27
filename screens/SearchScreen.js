//#
import React, { useState } from 'react';
import { View, TextInput, FlatList, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { api } from '../utils/api';

export default function SearchScreen({ navigation }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    const res = await api.search(query);
    setResults(res || []);
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <TextInput
        style={styles.input}
        placeholder="Введите запрос..."
        value={query}
        onChangeText={setQuery}
        onSubmitEditing={handleSearch}
      />
      <FlatList
        data={results}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.item} onPress={() => {/* навигация по типу объекта */}}>
            <Text style={styles.title}>{item.name || item.title}</Text>
            <Text style={styles.sub}>{item.description || item.email}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  input: { borderColor: '#ccc', borderWidth: 1, borderRadius: 8, padding: 10, marginBottom: 15 },
  item: { backgroundColor: '#fff', borderRadius: 7, padding: 10, marginBottom: 7 },
  title: { fontWeight: 'bold', fontSize: 15 },
  sub: { color: '#777' }
});
