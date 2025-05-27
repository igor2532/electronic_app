import React, { useEffect, useState } from 'react';
import { View, FlatList, Button, StyleSheet, Text, ScrollView, Modal, TouchableOpacity, ActivityIndicator } from 'react-native';
import { api } from '../utils/api';
import ProductCard from '../components/ProductCard';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import RangeSlider from 'rn-range-slider';

const Thumb = () => <View style={styles.thumb} />;
const Rail = () => <View style={styles.rail} />;
const RailSelected = () => <View style={styles.railSelected} />;
const Notch = () => <View style={styles.notch} />;
const Label = ({ text }) => <Text style={styles.label}>{text}</Text>;

export default function CatalogScreen({ route, navigation }) {
  const { categoryId } = route.params || {};
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

  const loadProducts = (reset = false) => {

    const attributeQuery = Object.entries(selectedAttributes).flatMap(([key, values]) =>
      values.map(v => `attribute_${key}=${v}`)
    );

    const params = {
      category: selectedCategories.join(','),
      min_price: minPrice,
      max_price: maxPrice,
      page: reset ? 1 : page,
      per_page: 10,
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
    navigation.setOptions({
      title: "Список товаров",
    });
  
    
    api.get('/products/categories').then(res => {
      setCategories(res.data.filter(cat => cat.count > 0));
    });
    api.get('/products/attributes').then(res => {
      setAttributes(res.data);
    });
  }, []);

  useEffect(() => {
    loadProducts(true);
  }, [selectedCategories, minPrice, maxPrice, selectedAttributes]);

  const toggleCategory = (id) => {
    setSelectedCategories((prev) => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);
  };

  const toggleAttribute = (slug, value) => {
    setSelectedAttributes(prev => {
      const values = prev[slug] || [];
      return {
        ...prev,
        [slug]: values.includes(value)
          ? values.filter(v => v !== value)
          : [...values, value],
      };
    });
  };

  return (
    <View style={{ flex: 1 }}>
     
      <TouchableOpacity style={styles.filterBtn} onPress={() => setFilterVisible(true)}>
        <Ionicons name="filter" size={24} color="white" />
        <Text style={styles.filterText}>Фильтры</Text>
      </TouchableOpacity>
      {products.length == 0 && (
        <ActivityIndicator style={{ display: loadedProducts ? 'none' : 'flex', marginTop: 50 }} size="large" color="#FF0000" />
      )
      }
     
      <FlatList
        contentContainerStyle={{ padding: 10 }}
        data={products}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) =>

        (
          <Animated.View entering={FadeInUp} style={{ marginBottom: 10 }}>
            <ProductCard
              product={item}
              onPress={() => navigation.navigate('ProductDetailsScreen', { product: item })}
            />
          </Animated.View>
        )}
      />
      {products.length > 0 && (
        <ActivityIndicator style={{ display: loadedProducts ? 'none' : 'flex' }} size="large" color="#FF0000" />
      )
      }
      {loadedProducts && (<Button color="#FF0000" style={{
        display: loadedProducts ? 'flex' : 'none',

      }} title="Загрузить еще" onPress={() => { setLoadProducts(false); loadProducts(); }} />)}
      <Modal visible={filterVisible} animationType="slide">
        <ScrollView contentContainerStyle={styles.modalContent}>
          <Text style={styles.filterTitle}>Фильтр по категориям</Text>
          <ScrollView horizontal>
            {categories.map(cat => (
              <Button
                key={cat.id}
                title={cat.name}
                color={selectedCategories.includes(cat.id) ? 'blue' : 'gray'}
                onPress={() => toggleCategory(cat.id)}
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
                      onPress={() => toggleAttribute(attr.slug, term.name)}>
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

const styles = StyleSheet.create({
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    padding: 10,
    margin: 10,
    borderRadius: 10,
    display: 'none'
  },
  filterText: {
    color: 'white',
    marginLeft: 10,
    fontSize: 16,
  },
  modalContent: {
    padding: 20,
  },
  filterTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginVertical: 10,
  },
  attrWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,

  },
  attrBtn: {
    padding: 8,
    backgroundColor: '#eee',
    borderRadius: 8,
    marginRight: 6,
    marginBottom: 6,
  },
  attrBtnSelected: {
    backgroundColor: '#cdeaff',
  },
  thumb: {
    width: 20,
    height: 20,
    backgroundColor: 'blue',
    borderRadius: 10,
  },
  rail: {
    flex: 1,
    height: 4,
    backgroundColor: '#ccc',
  },
  railSelected: {
    height: 4,
    backgroundColor: 'blue',
  },
  notch: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'blue',
  },
  label: {
    position: 'absolute',
    top: -20,
    fontSize: 12,
  },
});
