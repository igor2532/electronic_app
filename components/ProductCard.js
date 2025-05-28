import React, { useContext } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FavoritesContext } from '../navigation/FavoritesContext';

export default function ProductCard({ product, onPress, style }) {
  const { addFavorite, removeFavorite, isFavorite } = useContext(FavoritesContext);
  const fav = isFavorite(product.id);

  // Найти имя первой категории
  const categoryName = product.categories?.[0]?.name || '';

  return (
    <TouchableOpacity style={[styles.card, style]} onPress={onPress} activeOpacity={0.9}>
      {/* Сердечко справа вверху */}
      <TouchableOpacity
        onPress={() => fav ? removeFavorite(product.id) : addFavorite(product)}
        style={styles.heartBtn}
        hitSlop={8}
      >
        <Ionicons
          name={fav ? "heart" : "heart-outline"}
          size={24}
          color={fav ? "#F9227F" : "#FFF"}
        />
      </TouchableOpacity>
      <View style={styles.imgWrap}>
        <Image
          source={product.images[0]?.src ? { uri: product.images[0].src } : require('../assets/no-image.jpg')}
          style={styles.img}
          resizeMode="contain"
        />
      </View>
      <Text style={styles.name} numberOfLines={2}>{product.name}</Text>
      {categoryName !== '' && (
        <Text style={styles.category} numberOfLines={1}>{categoryName}</Text>
      )}
      <Text style={styles.price}>{product.price} BYN</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#23262F',
    borderRadius: 18,
    overflow: 'hidden',
    padding: 12,
    minHeight: 230,
    marginBottom: 8,
    marginRight: 2,
    marginLeft: 2,
    position: 'relative',
  },
  imgWrap: {
    width: '100%',
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#191B22',
    borderRadius: 10,
    marginBottom: 10,
    overflow: 'hidden',
  },
  img: {
    width: '95%',
    height: '95%',
    alignSelf: 'center',
  },
  name: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
    marginBottom: 6,
    minHeight: 35,
  },
  category: {
    color: '#1ac11a',
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 6,
    marginTop: -4,
    letterSpacing: 0.3,
  },
  price: {
    color: '#F9227F',
    fontWeight: 'bold',
    fontSize: 17,
    marginBottom: 5,
  },
  heartBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 2,
    backgroundColor: 'rgba(44,44,55,0.70)',
    borderRadius: 18,
    padding: 3,
  }
});
