//#
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

export default function NewsItem({ news }) {
  return (
    <View style={styles.card}>
      {news.image_url && (
        <Image source={{ uri: news.image_url }} style={styles.img} />
      )}
      <Text style={styles.title}>{news.title}</Text>
      <Text style={styles.content}>{news.content}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { padding: 10, backgroundColor: '#fff', marginBottom: 12, borderRadius: 12, elevation: 1 },
  img: { width: '100%', height: 140, borderRadius: 10, marginBottom: 10 },
  title: { fontWeight: 'bold', fontSize: 17, marginBottom: 3 },
  content: { color: '#444' },
});
