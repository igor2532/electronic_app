import React, { useContext } from 'react';
import { View, FlatList, Text, TouchableOpacity, StyleSheet, Image, Dimensions } from 'react-native';
import { FavoritesContext } from '../navigation/FavoritesContext';
import { Ionicons } from '@expo/vector-icons';

const screenWidth = Dimensions.get('window').width;
const ITEM_MARGIN = 12;
const ITEM_WIDTH = (screenWidth - 3 * ITEM_MARGIN) / 2;

export default function FavoritesScreen({ navigation }) {
  const { favorites, removeFavorite } = useContext(FavoritesContext);

  if (!favorites.length)
    return <View style={styles.center}><Text style={styles.empty}>Нет товаров в списке "Хочу купить"</Text></View>;

  const renderProduct = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.93}
      onPress={() => navigation.navigate('ProductDetailsScreen', { product: item })}
    >
      <Image
        source={item.images[0]?.src ? { uri: item.images[0].src } : require('../assets/no-image.jpg')}
        style={styles.img}
        resizeMode="contain"
      />
      <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
      <Text style={styles.price}>{item.price} BYN</Text>
      <TouchableOpacity style={styles.trashBtn} onPress={() => removeFavorite(item.id)}>
        <Ionicons name="trash" size={26} color="#F9227F" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#191B22' }}>
      <FlatList
        data={favorites}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        renderItem={renderProduct}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#191B22' },
  empty: { color: '#888', fontSize: 19, marginTop: 80 },
  listContainer: { padding: ITEM_MARGIN, paddingBottom: 80, backgroundColor: '#191B22' },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: ITEM_MARGIN },
  card: {
    width: ITEM_WIDTH,
    backgroundColor: '#23262F',
    borderRadius: 17,
    marginBottom: ITEM_MARGIN,
    marginRight: ITEM_MARGIN,
    padding: 13,
    elevation: 2,
    shadowColor: '#222',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    alignItems: 'center',
    position: 'relative',
  },
  img: {
    width: '100%',
    height: 90,
    borderRadius: 12,
    marginBottom: 10,
    backgroundColor: '#222',
  },
  name: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
    textAlign: 'center',
    minHeight: 36,
    marginBottom: 6,
  },
  price: {
    color: '#6fff76',
    fontWeight: 'bold',
    fontSize: 16.5,
    marginBottom: 6,
    textAlign: 'center',
  },
  trashBtn: {
    position: 'absolute',
    top: 10,
    right: 9,
    backgroundColor: 'rgba(44,44,55,0.67)',
    borderRadius: 20,
    padding: 3,
    zIndex: 2,
  },
});
