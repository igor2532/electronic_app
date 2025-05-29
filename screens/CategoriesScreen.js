import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
import { api } from '../utils/api';

const screenWidth = Dimensions.get('window').width;
const ITEM_MARGIN = 12;
const ITEM_WIDTH = (screenWidth - ITEM_MARGIN * 3) / 2;

export default function CategoriesScreen({ navigation }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    api.get('/products/categories?per_page=100')
      .then(res => {
        const filtered = res.data.filter(cat => cat.count > 0);
        setCategories(filtered);
      })
      .catch(console.error);
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => {
        navigation.navigate('CatalogScreen', { categoryId: item.id, categoryTitle: item.name });
      }}
    >
      <Image
        source={item.image?.src ? { uri: item.image.src } : require('../assets/no-image.jpg')}
        style={styles.image}
      />
      <Text style={styles.text} numberOfLines={2}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Каталог</Text>
      <FlatList
        data={categories}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.list}
        columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: ITEM_MARGIN }}
      />
    </View>
  );
}

const DARK_BG = '#191B22';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DARK_BG,
    paddingTop: 20,
    paddingHorizontal: ITEM_MARGIN,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    paddingTop:30,
    paddingLeft: 4,
    textAlign:'center'
  },
  list: {
    paddingBottom: 100,
  },
  item: {
    width: ITEM_WIDTH,
    backgroundColor: '#23262F',
    borderRadius: 16,
    padding: 10,
    alignItems: 'center',
  },
  image: {
    width: ITEM_WIDTH - 20,
    height: ITEM_WIDTH - 20,
    resizeMode: 'cover',
    borderRadius: 12,
    backgroundColor: '#2E3140',
  },
  text: {
    color: '#fff',
    marginTop: 10,
    textAlign: 'center',
    fontSize: 14,
  },
});
