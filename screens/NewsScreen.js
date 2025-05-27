//#
import React, { useEffect, useState } from 'react';
import { FlatList } from 'react-native';
import { api } from '../utils/api';
import NewsItem from '../components/NewsItem';

export default function NewsScreen() {
  const [news, setNews] = useState([]);
  useEffect(() => {
    api.getNews().then(setNews);
  }, []);
  return (
    <FlatList
      data={news}
      keyExtractor={item => item.id.toString()}
      renderItem={({ item }) => <NewsItem news={item} />}
    />
  );
}
