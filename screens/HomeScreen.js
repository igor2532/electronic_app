import React, { useContext, useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, Text, TouchableOpacity, Image, Dimensions, useWindowDimensions } from 'react-native';
import { api, getNews } from '../utils/api';
import ProductCard from '../components/ProductCard';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { MyContext } from '../navigation/Context';
import Swiper from 'react-native-swiper';
import FooterBar from './FooterBar';
import { Skeleton } from 'moti/skeleton';
import { ScrollView } from 'react-native-gesture-handler';

const screenWidth = Dimensions.get('window').width;
const ITEM_MARGIN = 12;
const ITEM_WIDTH = (screenWidth - 3 * ITEM_MARGIN) / 2;
export default function HomeScreen({ navigation }) {
  const {
    numColumns,
    ITEM_WIDTH,
    ITEM_MARGIN
  } = useContext(MyContext);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
useEffect(() => {
  getNews().then(data => {
    setNews(data);
    setLoading(false);
  });
}, []);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  useEffect(() => {
    setLoadingProducts(true);
    api.get('/products/categories?per_page=100')
      .then(res => setCategories(res.data.filter(cat => cat.count > 0 && cat.parent === 0)))
      .catch(console.error);
    api.get('/products?orderby=date&order=desc&per_page=20')
      .then(res => { setProducts(res.data); setLoadingProducts(false); })
      .catch(() => setLoadingProducts(false));
  }, []);

  // SKELETON COMPONENTS
  function CategoriesSkeleton({ num = 6 }) {
    return (
      <View style={{ flexDirection: "row", paddingVertical: 16, paddingHorizontal: 8 }}>
        {Array(num).fill().map((_, idx) => (
          <View key={idx} style={{ alignItems: "center", marginRight: 20 }}>
            <Skeleton show width={48} height={48} radius={18} color="#23262F" />
            <Skeleton show width={38} height={11} radius={4} color="#23262F" style={{ marginTop: 6 }} />
          </View>
        ))}
      </View>
    );
  }
  function ProductsSkeleton({ num = 8, ITEM_WIDTH = 160, ITEM_MARGIN = 12 }) {
    // num — количество skeleton-карточек, делай чётное для красивого выравнивания
    const rows = Math.ceil(num / 2);
    let idx = 0;
    return (
      <View>
        {Array(rows).fill().map((_, rowIdx) => (
          <View
            key={rowIdx}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: ITEM_MARGIN,
              paddingHorizontal: ITEM_MARGIN,
            }}>
            {[0, 1].map(col => {
              idx++;
              if (idx > num) return <View key={col} style={{ width: ITEM_WIDTH }} />;
              return (
                <View
                  key={col}
                  style={{
                    width: ITEM_WIDTH,
                    borderRadius: 16,
                    backgroundColor: 'transparent',
                    overflow: 'hidden',
                  }}>
                  <Skeleton show width={ITEM_WIDTH} height={120} radius={14} color="#dadbe3" />
                  <Skeleton show width={ITEM_WIDTH * 0.8} height={15} radius={5} color="#dadbe3" style={{ marginTop: 8, marginBottom: 4 }} />
                  <Skeleton show width={ITEM_WIDTH * 0.6} height={15} radius={5} color="#dadbe3" />
                </View>
              );
            })}
          </View>
        ))}
      </View>
    );
  }


  function SliderSkeleton() {
    return (
      <Skeleton show width="100%" height={138} radius={18} color="#23262F" style={{ marginBottom: 14 }} />
    );
  }

  // RENDERERS
  const renderCategory = ({ item }) => (
    <TouchableOpacity
      style={styles.carouselItem}
      onPress={() => navigation.navigate('CatalogScreen', { categoryId: item.id, categoryTitle: item.name })}
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

  const ListHeader = () => (
    <>
      {/* --- Слайдер --- */}
      <View style={styles.sliderWrap}>
        {loadingProducts
          ? <SliderSkeleton />
          : (
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
          )}
      </View>
      {/* --- Карусель категорий --- */}
      <View style={styles.carouselContainer}>
        {loadingProducts
          ? <CategoriesSkeleton num={6} />
          : (
            <FlatList
              horizontal
              data={categories}
              keyExtractor={item => item.id.toString()}
              renderItem={renderCategory}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 8 }}
            />
          )}
      </View>
      {/*Записи*/}
  <View style={{ paddingHorizontal: 16 }}>
  <Text style={{ color: '#fff', fontSize: 20, fontWeight: 'bold', marginVertical: 10 }}>Новости/Акции</Text>
  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
    {loading && <ProductsSkeleton num={1 * 2} numColumns={numColumns} ITEM_WIDTH={ITEM_WIDTH} ITEM_MARGIN={ITEM_MARGIN} />}
    {news.slice(0, 4).map(item => (
      <TouchableOpacity
        key={item.id}
        onPress={() => navigation.navigate('SingleScreen', { post: item })}
        style={{ width: 140, height: 140, marginRight: 12, backgroundColor: '#2a2b32', borderRadius: 12, overflow: 'hidden' }}
      >
        {item._embedded?.['wp:featuredmedia']?.[0]?.source_url && (
          <Image
            source={{ uri: item._embedded['wp:featuredmedia'][0].source_url }}
            style={{ width: '100%', height: '100%' }}
          />
        )}
      </TouchableOpacity>
    ))}
  </ScrollView>
</View>
      {/* --- Новые поступления --- */}
      <View style={styles.newBlock}>
        <Text style={styles.newProductsTitle}>Новые поступления</Text>
        <TouchableOpacity onPress={() => navigation.navigate('NewProductsScreen')}>
          <Text style={styles.moreBtn}>Еще </Text>
        </TouchableOpacity>
      </View>
      {/* Фейковые карточки для "Новые поступления" */}
      {loadingProducts && <ProductsSkeleton num={4 * 2} numColumns={numColumns} ITEM_WIDTH={ITEM_WIDTH} ITEM_MARGIN={ITEM_MARGIN} />}
      {/* Можно добавить еще другие skeleton-блоки при необходимости */}
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
          ListEmptyComponent={loadingProducts ? <ProductsSkeleton num={numColumns * 3} numColumns={numColumns} ITEM_WIDTH={ITEM_WIDTH} ITEM_MARGIN={ITEM_MARGIN} /> : null}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
        <FooterBar />
      </View>
    </>
  );
}

const DARK_BG = '#191B22';
const DARK_CARD = '#23262F';

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: DARK_BG },
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
  newBlock: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: 10, marginTop: 10, marginBottom: 17 },
  newProductsTitle: { fontWeight: 'bold', fontSize: 18, color: '#fff', letterSpacing: 0.3 },
  moreBtn: { color: '#fff', fontWeight: 'bold', fontSize: 15, marginLeft: 10, backgroundColor: '#dc1321', paddingLeft: 10, paddingRight: 10, paddingTop: 2, paddingBottom: 2, borderRadius: 5 },
  listContainer: { paddingHorizontal: ITEM_MARGIN, paddingBottom: 100, backgroundColor: DARK_BG },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: ITEM_MARGIN },
  productWrap: { width: ITEM_WIDTH, marginRight: ITEM_MARGIN, marginBottom: ITEM_MARGIN, backgroundColor: 'transparent' },
  productCardCustom: { backgroundColor: DARK_CARD, borderRadius: 16, overflow: 'hidden' },
});
