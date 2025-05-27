import React, { useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

export default function ProductCard({ product, onPress }) {
  
  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      <Image source={{ uri: product.images[0]?.src }} style={styles.image} />
      <Text style={styles.name}>{product.name.slice(0, 30)}</Text>
      <Text style={styles.category}>{product.categories[0]?.name}</Text>
      <Text style={styles.price}>{product.price} BYN</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    margin: 8,
    backgroundColor: '#fff'
  },
  image: {
    width: '100%',
    height: 150,
    objectFit:'contain'
  },
  name: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop:10,
  },
  category: {
    fontSize: 12,
    color: '#666',
  },
  price: {
    fontSize: 14,
    color: 'green',
  },
});
