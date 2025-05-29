// screens/BlogScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, ActivityIndicator, Dimensions } from 'react-native';
import { getNews } from '../utils/api';
const { width } = Dimensions.get('window');

export default function BlogScreen({ navigation }) {
  const [news, setNews] = useState([]);

  useEffect(() => {
    getNews().then(setNews);
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
    onPress={() => navigation.navigate('SingleScreen', { post: item })}
    style={{
      width: width / 2 - 20,
      height: width / 2 - 20,
      margin: 8,
      borderRadius: 12,
      overflow: 'hidden',
      backgroundColor: '#2a2b32'
    }}
  >
    {item._embedded?.['wp:featuredmedia']?.[0]?.source_url && (
      <Image
        source={{ uri: item._embedded['wp:featuredmedia'][0].source_url }}
        style={{ width: '100%', height: '100%' }}
      />
    )}
  </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#191B22', padding: 8 }}>
      <Text style={{ fontSize: 24, color: '#fff', fontWeight: 'bold', marginBottom: 12, marginTop: 20 }}>
        Свежие новости / акции
      </Text>
      {!news.length ? (
        <ActivityIndicator color="#1E90FF" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={news}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          renderItem={renderItem}
        />
      )}
    </View>
  );
}
