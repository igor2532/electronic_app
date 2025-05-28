import React, { useContext, useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Text, Modal, TouchableOpacity, ActivityIndicator, Dimensions, ScrollView, Button } from 'react-native';
import { api } from '../utils/api';
import ProductCard from '../components/ProductCard';
import Animated, { FadeInUp } from 'react-native-reanimated';
import RangeSlider from 'rn-range-slider';
import { MyContext } from '../navigation/Context';
import { Skeleton } from '@motify/skeleton';
import ProductsSkeleton from '../components/ProductsSkeleton';
const screenWidth = Dimensions.get('window').width;
const ITEM_MARGIN = 12;
const ITEM_WIDTH = (screenWidth - 3 * ITEM_MARGIN) / 2;

const Thumb = () => <View style={styles.thumb} />;
const Rail = () => <View style={styles.rail} />;
const RailSelected = () => <View style={styles.railSelected} />;
const Notch = () => <View style={styles.notch} />;
const Label = ({ text }) => <Text style={styles.label}>{text}</Text>;

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
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [selectedCategories, setSelectedCategories] = useState(categoryId ? [categoryId] : []);
  const [categories, setCategories] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [filterVisible, setFilterVisible] = useState(false);
  // const [categoryTitle, setCategoryTitle] = useState('Каталог');




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
 
      <FlatList
        data={products}
        keyExtractor={item => item.id.toString()}
        renderItem={renderProduct}

 ListHeaderComponent={() => (
        <View style={{ padding: 20, }}>
           <Text style={{ fontSize: 22, color:'#fff', textAlign:'center', fontWeight:'bold' }}>{categoryTitle}</Text>
        </View>
      )}


        // numColumns={2}
        // columnWrapperStyle={styles.row}

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
      {products.length > 0 && (
        <ActivityIndicator style={{ display: loadedProducts ? 'none' : 'flex' }} size="large" color="#1E90FF" />
      )}
      {loadedProducts && products.length >= 20 && (
        <Button color="#1E90FF" title="Загрузить еще" onPress={() => { setLoadProducts(false); loadProducts(); }} />
      )}

      <Modal visible={filterVisible} animationType="slide">
        <ScrollView contentContainerStyle={styles.modalContent}>
          <Text style={styles.filterTitle}>Фильтр по категориям</Text>
          <ScrollView horizontal>
            {categories.map(cat => (
              <Button
                key={cat.id}
                title={cat.name}
                color={selectedCategories.includes(cat.id) ? '#1E90FF' : '#444'}
                onPress={() => setSelectedCategories(prev => prev.includes(cat.id) ? prev.filter(c => c !== cat.id) : [...prev, cat.id])}
              />
            ))}
          </ScrollView>
          <Text style={styles.filterTitle}>Цена: {minPrice} ₽ - {maxPrice} ₽</Text>
          <RangeSlider
            min={0}
            max={50000}
            fromValue={minPrice}
            toValue={maxPrice}
            onValueChanged={(from, to) => {
              setMinPrice(from);
              setMaxPrice(to);
            }}
            renderThumb={Thumb}
            renderRail={Rail}
            renderRailSelected={RailSelected}
            renderLabel={Label}
            renderNotch={Notch}
          />

          {attributes.map(attr => (
            attr.terms?.length > 0 && (
              <View key={attr.id} style={{ marginVertical: 10 }}>
                <Text style={styles.filterTitle}>{attr.name}</Text>
                <View style={styles.attrWrap}>
                  {attr.terms.map(term => (
                    <TouchableOpacity
                      key={term.id}
                      style={[
                        styles.attrBtn,
                        (selectedAttributes[attr.slug] || []).includes(term.name) && styles.attrBtnSelected
                      ]}
                      onPress={() => {
                        setSelectedAttributes(prev => {
                          const values = prev[attr.slug] || [];
                          return {
                            ...prev,
                            [attr.slug]: values.includes(term.name)
                              ? values.filter(v => v !== term.name)
                              : [...values, term.name],
                          };
                        });
                      }}>
                      <Text>{term.name}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )
          ))}

          <Button title="Применить" onPress={() => setFilterVisible(false)} />
        </ScrollView>
      </Modal>
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
});


