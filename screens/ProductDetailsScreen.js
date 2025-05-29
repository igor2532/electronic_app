import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, Modal, Pressable, StyleSheet, Linking, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import Swiper from 'react-native-swiper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { MyContext } from '../navigation/Context';
import { sendProductRequest } from '../utils/api';
import { FavoritesContext } from '../navigation/FavoritesContext';
import { Ionicons } from '@expo/vector-icons';

export default function ProductDetailsScreen({ route, navigation }) {
  const { product } = route.params;
  const { user, addToRequest, requestItems } = useContext(MyContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [activeImage, setActiveImage] = useState(null);
  const [sending, setSending] = useState(false);
  const { addFavorite, removeFavorite, isFavorite } = useContext(FavoritesContext);
  const fav = isFavorite(product.id);
  const quantity = requestItems.find(p => p.id === product.id)?.qty || 0;

  useEffect(() => {
    navigation.setOptions({
      title: product.name,
    });
  }, []);

  const handleSendRequest = async () => {
    setSending(true);
    try {
      const res = await sendProductRequest({
        user,
        product: {
          name: product.name,
          price: product.price,
          permalink: product.permalink || product.url || '',
        }
      });
      Alert.alert('Запрос отправлен', 'Наш менеджер свяжется с вами.');
    } catch (e) {
      Alert.alert('Ошибка', 'Не удалось отправить запрос. Попробуйте позже.');
    }
    setSending(false);
  };

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#191B22' }}>
      <ScrollView contentContainerStyle={{ padding: 0, backgroundColor: '#191B22', paddingBottom: 50 }}>
        <View style={styles.swiperWrap}>
          <Swiper
            showsPagination
            dotStyle={{ backgroundColor: '#333', bottom: -10 }}
            activeDotStyle={{ backgroundColor: '#fff', bottom: -10 }}
            paginationStyle={{ bottom: -10 }}>
            {product.images.map(img => (
              <Pressable key={img.id} onPress={() => { setActiveImage(img.src); setModalVisible(true); }}>
                <Image source={{ uri: img.src }} style={styles.swiperImg} resizeMode="contain" />
              </Pressable>
            ))}
          </Swiper>
          <TouchableOpacity
            onPress={() => fav ? removeFavorite(product.id) : addFavorite(product)}
            style={styles.heartBtn}
            hitSlop={8}
          >
            <Ionicons
              name={fav ? "heart" : "heart-outline"}
              size={38}
              color={fav ? "#F9227F" : "#fff"}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>{product.name}</Text>
          <Text style={styles.price}>{product.price} BYN</Text>
          {!!product.description && (
            <Text style={styles.desc}>{product.description.replace(/<[^>]+>/g, '')}</Text>
          )}
          <Text style={styles.shopTitle}>ЧТУП »ТЕХНОИВЬЕ»</Text>
          <Text style={styles.rassrochka}>Рассрочка без переплат до 6 месяцев</Text>
          <Text style={styles.address}>г. Ивье, ул. Красноармейская, д. 2, каб. 15</Text>

          <TouchableOpacity
            style={[styles.requestBtn, { backgroundColor: '#F9227F', marginBottom: 12 }]}
            onPress={() => addToRequest(product)}
          >
            <Text style={styles.requestBtnText}>
              {quantity > 0 ? `В ЗАЯВКЕ (${quantity})` : 'ДОБАВИТЬ В ЗАЯВКУ'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.phoneBtn}
            onPress={() => Linking.openURL('tel:+375292898098')}
            activeOpacity={0.85}
          >
            <Text style={styles.phoneBtnText}>+375 (29) 289-80-98</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.requestBtn}
            onPress={handleSendRequest}
            disabled={sending}
            activeOpacity={0.88}
          >
            <Text style={styles.requestBtnText}>
              {sending ? 'Отправка...' : 'ОТПРАВИТЬ ЗАПРОС НА ТОВАР'}
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Характеристики:</Text>
        <View style={styles.table}>
          {product.attributes.map(attr => (
            <View key={attr.id} style={styles.row}>
              <Text style={styles.cellLabel}>{attr.name}</Text>
              <Text style={styles.cellValue}>{attr.options.join(', ')}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <Modal visible={modalVisible} transparent>
        <Pressable style={{ flex: 1, backgroundColor: '#000' }} onPress={() => setModalVisible(false)}>
          <Image source={{ uri: activeImage }} style={{ flex: 1, resizeMode: 'contain' }} />
        </Pressable>
      </Modal>
    </GestureHandlerRootView>
  );
}


const styles = StyleSheet.create({
  swiperWrap: {
    height: 310,
    backgroundColor: '#181A20',
    position: 'relative',
    marginBottom: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#262837',
    marginTop:50
  },
  swiperImg: {
    width: '100%',
    height: 300,
    alignSelf: 'center',
    backgroundColor: '#191B22',
  },
  heartBtn: {
    position: 'absolute',
    top: 18,
    right: 16,
    zIndex: 10,
    backgroundColor: 'rgba(44,44,55,0.45)',
    borderRadius: 30,
    padding: 4,
    elevation: 3,
  },
  content: {
    backgroundColor: '#23262F',
    borderBottomLeftRadius: 26,
    borderBottomRightRadius: 26,
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 15,
    marginBottom: 9,
  },
  title: {
    fontSize: 22,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 11,
  },
  price: {
    fontSize: 23,
    color: '#6fff76',
    marginBottom: 13,
    fontWeight: 'bold',
  },
  desc: {
    fontSize: 15,
    color: '#ccc',
    marginBottom: 11,
  },
  shopTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#B6B6B6',
    marginBottom: 4,
  },
  rassrochka: {
    fontSize: 16,
    color: '#F9227F',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  address: {
    fontSize: 14,
    color: '#aaa',
    marginBottom: 14,
  },
  phoneBtn: {
    backgroundColor: '#F00',
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    marginBottom: 14,
    marginTop: 4,
    elevation: 2,
  },
  phoneBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 19,
    letterSpacing: 1,
  },
  requestBtn: {
    backgroundColor: '#1976D2',
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    marginBottom: 15,
    elevation: 2,
  },
  requestBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  sectionTitle: {
    fontSize: 17,
    color: '#fff',
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 8,
    marginLeft: 14,
  },
  table: {
    backgroundColor: '#23262F',
    borderRadius: 18,
    padding: 13,
    marginHorizontal: 10,
    marginBottom: 25,
    elevation: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  cellLabel: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
    flex: 1.5,
    marginRight: 8,
  },
  cellValue: {
    color: '#aaa',
    fontSize: 15,
    flex: 2,
    textAlign: 'right',
  },
});
