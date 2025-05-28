import React, { useEffect, useState } from 'react';
import { View, FlatList, ActivityIndicator, StyleSheet, Dimensions } from 'react-native';
import { api } from '../utils/api';
import ProductCard from '../components/ProductCard';

const screenWidth = Dimensions.get('window').width;
const ITEM_MARGIN = 12;
const ITEM_WIDTH = (screenWidth - 3 * ITEM_MARGIN) / 2;

export default function NewProductsScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/products?orderby=date&order=desc&per_page=50')
      .then(res => { setProducts(res.data); setLoading(false); })
      .catch(() => setLoading(false));
    navigation.setOptions({ title: 'Новые поступления' });
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: '#191B22' }}>
      <FlatList
        data={products}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onPress={() => navigation.navigate('ProductDetailsScreen', { product: item })}
            style={{ width: ITEM_WIDTH, backgroundColor: '#23262F', borderRadius: 16 }}
          />
        )}
        numColumns={2}
        columnWrapperStyle={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: ITEM_MARGIN }}
        contentContainerStyle={{ padding: ITEM_MARGIN, paddingBottom: 100, backgroundColor: '#191B22' }}
        ListEmptyComponent={loading ? <ActivityIndicator style={{ marginTop: 50 }} size="large" color="#1E90FF" /> : null}
      />
    </View>
  );
}
