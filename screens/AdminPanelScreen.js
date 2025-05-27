//#
import React, { useContext, useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { MyContext } from '../navigation/Context';
import { api } from '../utils/api';

export default function AdminPanelScreen() {
  const { user } = useContext(MyContext);
  const [clients, setClients] = useState([]);
  const [news, setNews] = useState([]);

  useEffect(() => {
    if (user?.role === 'admin') {
      api.getClients().then(setClients);
      api.getNews().then(setNews);
    }
  }, [user]);

  if (user?.role !== 'admin') return <Text style={{margin: 20}}>Нет доступа</Text>;

  return (
    <View style={{ flex: 1, padding: 15 }}>
      <Text style={styles.header}>Панель администратора</Text>
      <Text style={styles.sectionTitle}>Клиенты</Text>
      <FlatList
        data={clients}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.clientItem}>
            <Text style={{ fontWeight: 'bold' }}>{item.email}</Text>
            <Text>Бонусов: {item.bonus_balance}</Text>
            <Text>Роль: {item.role}</Text>
          </View>
        )}
      />
      <Text style={styles.sectionTitle}>Новости/Акции</Text>
      <FlatList
        data={news}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.newsItem}>
            <Text style={{ fontWeight: 'bold' }}>{item.title}</Text>
            <Text>{item.content}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 12 },
  sectionTitle: { marginTop: 24, marginBottom: 10, fontWeight: 'bold', fontSize: 17 },
  clientItem: { backgroundColor: '#e3f2fd', borderRadius: 8, padding: 10, marginBottom: 6 },
  newsItem: { backgroundColor: '#fffbe9', borderRadius: 8, padding: 10, marginBottom: 6 },
});
