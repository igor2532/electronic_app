import React, { useContext, useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Text,  TouchableOpacity, ActivityIndicator, Dimensions, ScrollView, Button } from 'react-native';
import { api } from '../utils/api';
import ProductCard from '../components/ProductCard';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { MyContext } from '../navigation/Context';
import { Skeleton } from 'moti/skeleton';
import ProductsSkeleton from '../components/ProductsSkeleton';
import { Ionicons } from '@expo/vector-icons';
import Modal from 'react-native-modal';
import Slider from '@react-native-community/slider';
const screenWidth = Dimensions.get('window').width;
const ITEM_MARGIN = 12;
const ITEM_WIDTH = (screenWidth - 3 * ITEM_MARGIN) / 2;

const Thumb = () => <View style={styles.thumb} />;
const Rail = () => <View style={styles.rail} />;
const RailSelected = () => <View style={styles.railSelected} />;
const Notch = () => <View style={styles.notch} />;
const Label = ({ text }) => (
  <View style={{ alignItems: 'center' }}>
    <Text style={styles.label}>{text}</Text>
  </View>
);


export default function CatalogScreen({ route, navigation }) {
     const {
    user,
    setUser,
    logout,
    width,
    height,
    isLandscape,
    numColumns,
    ITEM_WIDTH,
    ITEM_MARGIN
  } = useContext(MyContext);
  const { categoryId,categoryTitle } = route.params || {};
  const [products, setProducts] = useState([]);
  const [loadedProducts, setLoadProducts] = useState(false);
  const [page, setPage] = useState(1);

  const [selectedCategories, setSelectedCategories] = useState(categoryId ? [categoryId] : []);
  const [categories, setCategories] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [selectedAttributes, setSelectedAttributes] = useState({});
 const [filterVisible, setFilterVisible] = useState(false);
  const [minPrice, setMinPrice] = useState(0);
  const [tempMin, setTempMin] = useState(0);
  const [maxPrice, setMaxPrice] = useState(50000);
  const [tempMax, setTempMax] = useState(50000);
  // const [categoryTitle, setCategoryTitle] = useState('Каталог');
const [sortBy, setSortBy] = useState('date');



  const loadProducts = (reset = false) => {
    const attributeQuery = Object.entries(selectedAttributes).flatMap(([key, values]) =>
      values.map(v => `attribute_${key}=${v}`)
    );

    const params = {
      category: selectedCategories.join(','),
      min_price: minPrice,
      max_price: maxPrice,
      page: reset ? 1 : page,
      per_page: 20,
    };
if (sortBy === 'price_asc') {
  params.orderby = 'price';
  params.order = 'asc';
} else if (sortBy === 'price_desc') {
  params.orderby = 'price';
  params.order = 'desc';
} else if (sortBy === 'name') {
  params.orderby = 'title';
  params.order = 'asc';
} else if (sortBy === 'name_desc') {
  params.orderby = 'title';
  params.order = 'desc';
} else if (sortBy === 'date_desc') {
  params.orderby = 'date';
  params.order = 'desc';
} else {
  params.orderby = 'date';
  params.order = 'asc';
}
    api.get(`/products?${new URLSearchParams(params).toString()}&${attributeQuery.join('&')}`)
      .then(res => {
        if (reset) {
          setProducts(res.data);
          setPage(2);
          setLoadProducts(true);
        } else {
          setProducts(prev => [...prev, ...res.data]);
          setPage(prev => prev + 1);
          setLoadProducts(true);
        }
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    api.get('/products/categories').then(res => {
      const filteredCats = res.data.filter(cat => cat.count > 0);
      setCategories(filteredCats);

      // Название выбранной категории для шапки
      if (categoryId) {
        const selectedCat = filteredCats.find(cat => String(cat.id) === String(categoryId));
        // setCategoryTitle(selectedCat ? selectedCat.name : 'Каталог');
        navigation.setOptions({ title: selectedCat ? selectedCat.name : 'Каталог' });
      } else {
        // setCategoryTitle('Каталог');
        navigation.setOptions({ title: 'Каталог' });
      }
    });
    api.get('/products/attributes').then(res => {
      setAttributes(res.data);
    });
  }, []);

  useEffect(() => {
    loadProducts(true);
  }, [selectedCategories, minPrice, maxPrice, selectedAttributes]);

  const renderProduct = ({ item }) => (
    <Animated.View entering={FadeInUp} style={styles.productWrap}>
      <ProductCard
        product={item}
        onPress={() => navigation.navigate('ProductDetailsScreen', { product: item })}
          style={[styles.productCardCustom, { width: ITEM_WIDTH }]}
      />
    </Animated.View>
  );

  return (
   
    <View style={styles.root}>
       

     <Modal isVisible={filterVisible} useNativeDriver={false} propagateSwipe={true}
        onBackdropPress={() => setFilterVisible(false)}
        style={{ justifyContent: 'flex-end', margin: 0 }}
      >
        <View style={{ backgroundColor: '#1e1f26', borderTopLeftRadius: 22, borderTopRightRadius: 22, padding: 20 }}>
          <View style={{ width: 40, height: 4, backgroundColor: '#555', alignSelf: 'center', borderRadius: 2, marginBottom: 12 }} />
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#fff', marginBottom: 18 }}>Фильтр</Text>
          <Text style={{ fontSize: 15, color: '#bbb', marginBottom: 8 }}>Цена: {minPrice} BYN – {maxPrice} BYN</Text>

          <View style={{
            width: screenWidth - 60,
            alignSelf: 'center',
            marginTop: 20,
            marginBottom: 20,
            backgroundColor: '#2a2b32',
            paddingVertical: 16,
            paddingHorizontal: 10,
            borderRadius: 12
          }}>
            <Text style={{ color: '#bbb', fontSize: 14, marginBottom: 6 }}>
              Мин. цена: {tempMin} BYN
            </Text>
            <Slider
              minimumValue={0}
              maximumValue={50000}
              step={10}
              value={minPrice}
              onValueChange={value => setTempMin(value)}
              onSlidingComplete={value => setMinPrice(value)}
              minimumTrackTintColor="#1E90FF"
              maximumTrackTintColor="#444"
              thumbTintColor="#1E90FF"
            />

            <Text style={{ color: '#bbb', fontSize: 14, marginTop: 20, marginBottom: 6 }}>
              Макс. цена: {tempMax} BYN
            </Text>
            <Slider
              minimumValue={0}
              maximumValue={50000}
              step={10}
              value={maxPrice}
              onValueChange={value => setTempMax(value)}
              onSlidingComplete={value => setMaxPrice(value)}
              minimumTrackTintColor="#1E90FF"
              maximumTrackTintColor="#444"
              thumbTintColor="#1E90FF"
            />
          </View>

          <TouchableOpacity
            onPress={() => setFilterVisible(false)}
            style={{ backgroundColor: '#1E90FF', paddingVertical: 14, borderRadius: 12, marginTop: 28 }}>
            <Text style={{ color: '#fff', textAlign: 'center', fontSize: 16, fontWeight: 'bold' }}>Применить</Text>
          </TouchableOpacity>
        </View>
      </Modal>


{!loadedProducts ? (
  <View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
    {[...Array(6)].map((_, i) => (
      <View
        key={i}
        style={{
          height: 150,
          backgroundColor: '#2a2b32',
          borderRadius: 16,
          marginBottom: 12,
          opacity: 0.3,
        }}
      />
    ))}
  </View>
) : (

      <FlatList
        data={products}
        keyExtractor={item => item.id.toString()}
        renderItem={renderProduct}
ListEmptyComponent={null}
ListHeaderComponent={() => (
<View style={{ paddingHorizontal: 20, paddingTop: 20, marginBottom: 20 }}>
  <Text style={{ fontSize: 22, color: '#fff', fontWeight: 'bold', marginBottom: 12 }}>
    {categoryTitle || 'Категория'}
  </Text>

  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
      <TouchableOpacity
onPress={() => {
  setSortBy(prev => prev === 'date' ? 'date_desc' : 'date');
  setLoadProducts(false);
  setTimeout(() => loadProducts(true), 100);
}}

        style={{
          paddingHorizontal: 12,
          paddingVertical: 6,
          borderRadius: 20,
          backgroundColor: sortBy.includes('date') ? '#1E90FF' : '#2a2b32',
          flexDirection: 'row',
          alignItems: 'center',
          marginRight: 8
        }}
      >
        <Text style={{ color: '#fff', fontSize: 12 }}>🕓</Text>
        <Text style={{ color: '#fff', marginLeft: 4 }}>{sortBy === 'date_desc' ? '↓' : '↑'}</Text>
      </TouchableOpacity>

      <TouchableOpacity
     onPress={() => {
  setSortBy(prev => prev === 'name' ? 'name_desc' : 'name');
  setLoadProducts(false);
  setTimeout(() => loadProducts(true), 100);
}}

        style={{
          paddingHorizontal: 12,
          paddingVertical: 6,
          borderRadius: 20,
          backgroundColor: sortBy.includes('name') ? '#1E90FF' : '#2a2b32',
          flexDirection: 'row',
          alignItems: 'center',
          marginRight: 8
        }}
      >
        <Text style={{ color: '#fff', fontSize: 12 }}>A-Я</Text>
        <Text style={{ color: '#fff', marginLeft: 4 }}>{sortBy === 'name_desc' ? '↓' : '↑'}</Text>
      </TouchableOpacity>

      <TouchableOpacity
onPress={() => {
  setSortBy(prev => prev === 'price_asc' ? 'price_desc' : 'price_asc');
  setLoadProducts(false);
  setTimeout(() => loadProducts(true), 100);
}}

        style={{
          paddingHorizontal: 12,
          paddingVertical: 6,
          borderRadius: 20,
          backgroundColor: sortBy.includes('price') ? '#1E90FF' : '#2a2b32',
          flexDirection: 'row',
          alignItems: 'center',
          marginRight: 8
        }}
      >
        <Text style={{ color: '#fff', fontSize: 12 }}>₽</Text>
        <Text style={{ color: '#fff', marginLeft: 4 }}>{sortBy === 'price_desc' ? '↓' : '↑'}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => setFilterVisible(true)}
        style={{
          paddingHorizontal: 12,
          paddingVertical: 6,
          borderRadius: 20,
          backgroundColor: '#2a2b32',
          flexDirection: 'row',
          alignItems: 'center'
        }}
      >
        <Ionicons name="filter-outline" size={18} color="#fff" />
        <Text style={{ color: '#fff', fontSize: 12, marginLeft: 6 }}>Фильтр</Text>
      </TouchableOpacity>
    </View>
  </ScrollView>
</View>
)}
 key={numColumns}
       numColumns={numColumns}
  columnWrapperStyle={{
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: ITEM_MARGIN,
  }}





      ListEmptyComponent={loadedProducts
  ? null
  : <ProductsSkeleton num={12} ITEM_WIDTH={ITEM_WIDTH} ITEM_MARGIN={ITEM_MARGIN} />
}

        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

)}

      {products.length > 0 && (
        <ActivityIndicator style={{ display: loadedProducts ? 'none' : 'flex' }} size="large" color="#1E90FF" />
      )}
      {loadedProducts && products.length >= 20 && (
        <Button color="#1E90FF" title="Загрузить еще" onPress={() => { setLoadProducts(false); loadProducts(); }} />
      )}




    </View>
    
  );
}

const DARK_BG = '#191B22';
const DARK_CARD = '#23262F';

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: DARK_BG },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E90FF',
    padding: 10,
    margin: 10,
    borderRadius: 10,
    alignSelf: 'flex-start'
  },
  filterText: {
    color: '#fff',
    marginLeft: 10,
    fontSize: 16,
  },
  modalContent: {
    padding: 20,
    backgroundColor: DARK_BG,
  },
  filterTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginVertical: 10,
    color: '#fff'
  },
  attrWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  attrBtn: {
    padding: 8,
    backgroundColor: '#333',
    borderRadius: 8,
    marginRight: 6,
    marginBottom: 6,
  },
  attrBtnSelected: {
    backgroundColor: '#1E90FF',
  },
  thumb: {
    width: 20,
    height: 20,
    backgroundColor: '#1E90FF',
    borderRadius: 10,
  },
  rail: {
    flex: 1,
    height: 4,
    backgroundColor: '#444',
  },
  railSelected: {
    height: 4,
    backgroundColor: '#1E90FF',
  },
  notch: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#1E90FF',
  },
  label: {
    position: 'absolute',
    top: -20,
    fontSize: 12,
    color: '#fff'
  },
  listContainer: { paddingHorizontal: ITEM_MARGIN, paddingBottom: 100, backgroundColor: DARK_BG, marginTop:46 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: ITEM_MARGIN },
  productWrap: {  marginBottom: ITEM_MARGIN, backgroundColor: 'transparent' },
  productCardCustom: { backgroundColor: DARK_CARD, borderRadius: 16, overflow: 'hidden' },
  sortBtn: {
  color: '#bbb',
  fontSize: 14,
  paddingHorizontal: 12,
  paddingVertical: 6,
  borderRadius: 8,
  backgroundColor: '#2a2b32',
  overflow: 'hidden',
  marginHorizontal: 4
},
sortActive: {
  color: '#fff',
  backgroundColor: '#1E90FF',
  fontWeight: 'bold'
},

});


