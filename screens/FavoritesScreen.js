import React, { useContext } from 'react';
import { View, FlatList, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { FavoritesContext } from '../navigation/FavoritesContext';
import { Ionicons } from '@expo/vector-icons';
export default function FavoritesScreen({ navigation }) {
  const { favorites, removeFavorite } = useContext(FavoritesContext);

  if (!favorites.length)
    return <View style={styles.center}><Text style={styles.empty}>Нет товаров в списке "Хочу купить"</Text></View>;

  return (
    <FlatList
      data={favorites}
      keyExtractor={item => item.id.toString()}
      contentContainerStyle={{ padding: 12 }}
      renderItem={({ item }) => (
        <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('ProductDetailsScreen', { product: item })}>
          <Image source={{ uri: item.images[0]?.src }} style={styles.img} />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.price}>{item.price} BYN</Text>
          </View>
          <TouchableOpacity onPress={() => removeFavorite(item.id)}>
            <Ionicons name="trash" size={28} color="#d32f2f" />
          </TouchableOpacity>
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  empty: { color: '#888', fontSize: 19, marginTop: 80 },
  item: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, padding: 12, marginBottom: 12, elevation: 2 },
  img: { width: 60, height: 60, borderRadius: 10, backgroundColor: '#eee' },
  name: { fontWeight: 'bold', fontSize: 17 },
  price: { fontSize: 16, color: '#1976D2', marginTop: 2 },
});
