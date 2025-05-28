import React, { useContext, useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, Text, TextInput, TouchableOpacity, Image, Dimensions,useWindowDimensions  } from 'react-native';
import { api } from '../utils/api';
import ProductCard from '../components/ProductCard';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { MyContext } from '../navigation/Context';
import Swiper from 'react-native-swiper';
import FooterBar from './FooterBar';

const screenWidth = Dimensions.get('window').width;
const ITEM_MARGIN = 12;
const ITEM_WIDTH = (screenWidth - 3 * ITEM_MARGIN) / 2;

export default function HomeScreen({ navigation }) {
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

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [search, setSearch] = useState('');
  useEffect(() => {
    api.get('/products/categories?per_page=100')
      .then(res => setCategories(res.data.filter(cat => cat.count > 0)))
      .catch(console.error);
    setLoadingProducts(true);
    api.get('/products?orderby=date&order=desc&per_page=20')
      .then(res => { setProducts(res.data); setLoadingProducts(false); })
      .catch(() => setLoadingProducts(false));
  }, []);

  const renderCategory = ({ item }) => (
    <TouchableOpacity
      style={styles.carouselItem}
      onPress={() => navigation.navigate('CatalogScreen', { categoryId: item.id })}
    >
      <View style={styles.categoryIconWrap}>
        <Image
          source={item.image?.src ? { uri: item.image.src } : require('../assets/no-image.jpg')}
          style={styles.carouselImage}
        />
      </View>
      <Text style={styles.carouselText} numberOfLines={2}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderProduct = ({ item }) => (
    <Animated.View entering={FadeInDown} style={[styles.productWrap, { width: ITEM_WIDTH }]}>
      <ProductCard
        product={item}
        onPress={() => navigation.navigate('ProductDetailsScreen', { product: item })}
        style={styles.productCardCustom}
      />
    </Animated.View>
  );

  // Всё, что должно быть "над товарами", кладём в ListHeaderComponent:
  const ListHeader = () => (
    <>
     
   

      {/* --- Слайдер --- */}
      <View style={styles.sliderWrap}>
        <Swiper showsPagination loop autoplay height={138} activeDotColor="transparent">
        
            <View style={styles.slide}>
              <Image source={require('../assets/rassr.png')} style={styles.slideImg} resizeMode="cover" />
              <Text style={styles.sliderText}>Рассрочка без переплат до 6 месяцев</Text>
            </View>
          <View style={styles.slide}>
              <Image source={require('../assets/dilevery.jpg')} style={styles.slideImg} resizeMode="cover" />
              <Text style={styles.sliderText}>Бесплатная доставка</Text>
            </View>
        </Swiper>
      </View>

      {/* --- Карусель категорий --- */}
      <View style={styles.carouselContainer}>
        <FlatList
          horizontal
          data={categories}
          keyExtractor={item => item.id.toString()}
          renderItem={renderCategory}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 8 }}
        />
      </View>

      {/* --- Новые поступления --- */}
      <View style={styles.newBlock}>
        <Text style={styles.newProductsTitle}>Новые поступления</Text>
        <TouchableOpacity onPress={() => navigation.navigate('NewProductsScreen')}>
          <Text style={styles.moreBtn}>Еще </Text>
        </TouchableOpacity>
      </View>
    </>
  );

  return (
    <>
    <View style={styles.root}>
      <FlatList

      

        ListHeaderComponent={<ListHeader />}
        data={products}
        keyExtractor={item => item.id.toString()}
        renderItem={renderProduct}
        key={numColumns}
       numColumns={numColumns}
  columnWrapperStyle={{
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: ITEM_MARGIN,
  }}
        // columnWrapperStyle={styles.row}
        ListEmptyComponent={loadingProducts ? <ActivityIndicator style={{ marginTop: 50 }} size="large" color="#1E90FF" /> : null}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
    
    </>
    
    
  );
}

const DARK_BG = '#191B22';
const DARK_CARD = '#23262F';

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: DARK_BG },

  // Новый современный блок поиска и адреса
 

  sliderWrap: { height: 178, marginBottom: 14, backgroundColor: DARK_BG },
  slide: { flex: 1, borderRadius: 0, overflow: 'hidden', justifyContent: 'center', alignItems: 'center', position: 'relative' },
  slideImg: { width: '100%', height: '100%', position: 'absolute', left: 0, top: 0, opacity: 0.73 },
  sliderText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
    backgroundColor: 'rgba(44,44,55,0.78)',
    width: '100%',
    textAlign: 'center',
    paddingVertical: 15,
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
  carouselContainer: {
    paddingVertical: 14,
    backgroundColor: DARK_CARD,
    marginBottom: 14,
    borderRadius: 18,
    flexDirection: 'row',
  },
  categoryIconWrap: {
    backgroundColor: '#2E3140',
    borderRadius: 18,
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  carouselItem: { width: 72, alignItems: 'center', marginRight: 20 },
  carouselImage: { width: 36, height: 36, borderRadius: 12, backgroundColor: '#222' },
  carouselText: { fontSize: 12, color: '#fff', textAlign: 'center', marginTop: 2 },
  newBlock: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: 10, marginTop:10, marginBottom: 17 },
  newProductsTitle: { fontWeight: 'bold', fontSize: 18, color: '#fff', letterSpacing: 0.3 },
  moreBtn: { color: '#fff', fontWeight: 'bold', fontSize: 15, marginLeft: 10, backgroundColor:'#dc1321', paddingLeft:10,paddingRight:10,paddingTop:2,paddingBottom:2, 
    borderRadius:5
   },
  listContainer: { paddingHorizontal: ITEM_MARGIN, paddingBottom: 100, backgroundColor: DARK_BG },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: ITEM_MARGIN },
  productWrap: { width: ITEM_WIDTH, marginRight: ITEM_MARGIN, marginBottom: ITEM_MARGIN, backgroundColor: 'transparent' },
  productCardCustom: { backgroundColor: DARK_CARD, borderRadius: 16, overflow: 'hidden' },
});
