import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, Modal, Pressable, StyleSheet, Linking, ActivityIndicator, Button, TouchableOpacity, Alert } from 'react-native';
import Swiper from 'react-native-swiper';
import { GestureHandlerRootView, PinchGestureHandler } from 'react-native-gesture-handler';
import { MyContext } from '../navigation/Context';
import { sendProductRequest } from '../utils/api';
import { FavoritesContext } from '../navigation/FavoritesContext';
import { Ionicons } from '@expo/vector-icons';
export default function ProductDetailsScreen({ route, navigation }) {
  const { product } = route.params;
  const { user } = useContext(MyContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [activeImage, setActiveImage] = useState(null);
  const [sending, setSending] = useState(false);
  const { addFavorite, removeFavorite, isFavorite } = useContext(FavoritesContext);

  const fav = isFavorite(product.id);

  useEffect(() => {
    navigation.setOptions({
      title: product.name,
    });
  }, [])
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
      console.log('Product request response:', res);
      Alert.alert('Запрос отправлен', 'Наш менеджер свяжется с вами.');
    } catch (e) {
      console.log('Product request error:', e);
      Alert.alert('Ошибка', 'Не удалось отправить запрос. Попробуйте позже.');
    }
    setSending(false);
  };
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: 15 }}>
        {/* ... swiper и вся остальная разметка ... */}
        <View style={{ height: 300 }}>
          <Swiper
            showsPagination
            dotStyle={{ backgroundColor: '#ccc', bottom: -10 }}
            activeDotStyle={{ backgroundColor: 'black', bottom: -10 }}
            paginationStyle={{ bottom: -10 }}>
            {product.images.map(img => (
              <Pressable key={img.id} onPress={() => { setActiveImage(img.src); setModalVisible(true); }}>
                <Image source={{ uri: img.src }} style={{ height: 300, resizeMode: 'contain' }} />
              </Pressable>
            ))}
          </Swiper>
          <TouchableOpacity
  onPress={() => fav ? removeFavorite(product.id) : addFavorite(product)}
  style={{
    position: 'absolute',
    top: 18,
    right: 10,
    zIndex: 10,
    backgroundColor: 'rgba(255,255,255,0.90)',
    borderRadius: 30,
    padding: 4,
    elevation: 4,
  }}
  hitSlop={8}
>
  <Ionicons
    name={fav ? "heart" : "heart-outline"}
    size={36}
    color={fav ? "#F00" : "#F00"}
  />
</TouchableOpacity>

        </View>
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginVertical: 30 }}>{product.name}</Text>
        <Text style={{ fontSize: 26, color: 'green', marginBottom: 15 }}>{product.price} BYN</Text>
        <Text style={{ fontSize: 16, marginBottom: 10 }}>{product.description.replace(/<[^>]+>/g, '')}</Text>
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: 'black' }}>ЧТУП »ТЕХНОИВЬЕ»</Text>
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: '#F00' }}>Рассрочка без переплат до 6 месяцев</Text>
        <Text style={{ fontSize: 15, fontWeight: 'bold', marginBottom: 10, color: 'black' }}>г. Ивье, ул. Красноармейская, д. 2, каб. 15</Text>

        <TouchableOpacity
          style={styles.phoneBtn}
          onPress={() => Linking.openURL('tel:+375292898098')}
          activeOpacity={0.8}
        >
          <Text style={styles.phoneBtnText}>+375 (29) 289-80-98</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.requestBtn}
          onPress={handleSendRequest}
          disabled={sending}
          activeOpacity={0.8}
        >
          <Text style={styles.requestBtnText}>
            {sending ? 'Отправка...' : 'Отправить запрос на товар'}
          </Text>
        </TouchableOpacity>

        {/* ... остальные блоки ... */}
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Характеристики:</Text>
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
        <Pressable style={{ flex: 1, backgroundColor: 'black' }} onPress={() => setModalVisible(false)}>
          <Image source={{ uri: activeImage }} style={{ flex: 1, resizeMode: 'contain' }} />
        </Pressable>
      </Modal>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  table: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  cellLabel: {
    fontWeight: 'bold',
    fontSize: 16,
    flex: 1,
  },
  cellValue: {
    fontSize: 16,
    flex: 2,
  },
  phoneBtn: {
    backgroundColor: '#F00',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    marginBottom: 18,
    marginTop: 10,
    elevation: 2,
  },
  phoneBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 23,
    letterSpacing: 1,
  },
  requestBtn: {
    backgroundColor: '#1976D2',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    marginBottom: 22,
    elevation: 2,
  },
  requestBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 19,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});
