import React, { useContext, useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, Alert, Dimensions, ActivityIndicator } from 'react-native';
import { MyContext } from '../navigation/Context';
import { sendProductRequest } from '../utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width;
const ITEM_MARGIN = 12;
const ITEM_WIDTH = (screenWidth - 3 * ITEM_MARGIN) / 2;

export default function RequestScreen() {
  const { user, requestItems, removeFromRequest, numColumns, setRequestItems } = useContext(MyContext);
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    AsyncStorage.setItem('requestItems', JSON.stringify(requestItems));
  }, [requestItems]);

  const handleSubmitRequest = async () => {
    if (!user || requestItems.length === 0) {
      Alert.alert('Ошибка', 'Нет данных для заявки.');
      return;
    }

    try {
      setLoading(true);
      await sendProductRequest({
        user,
        products: requestItems
      });
      await AsyncStorage.removeItem('requestItems');
      setRequestItems && setRequestItems([]);
      Alert.alert('Готово', 'Заявка успешно отправлена!', [
        { text: 'OK', onPress: () => navigation.navigate('Главная') }
      ]);
    } catch (e) {
      Alert.alert('Ошибка', e.message);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('ProductDetailsScreen', { product: item })}
      activeOpacity={0.9}
    >
      <Animated.View entering={FadeInDown} style={[styles.card, { width: ITEM_WIDTH }]}> 
        <TouchableOpacity
          onPress={() => removeFromRequest(item.id)}
          style={styles.trashIcon}
        >
          <Ionicons name="trash-outline" size={24} color="#F9227F" />
        </TouchableOpacity>

        <Image source={{ uri: item.images[0]?.src }} style={styles.image} />
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={styles.title}>{item.name}</Text>
          <Text style={styles.price}>{item.price} BYN</Text>
          <Text style={styles.quantity}>Кол-во: {item.qty || 1} шт</Text>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>📋 Ваша заявка</Text>

      <FlatList
        data={requestItems}
        key={numColumns}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: ITEM_MARGIN }}
        contentContainerStyle={{ padding: ITEM_MARGIN, paddingBottom: 130 }}
      />

      {requestItems.length > 0 && (
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmitRequest} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="send-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.submitText}>Оформить заявку</Text>
            </View>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#191B22',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 34,
    marginBottom: 16,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  card: {
    flexDirection: 'column',
    backgroundColor: '#2A2D3A',
    padding: 14,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 110,
    borderRadius: 12,
    marginBottom: 12,
  },
  title: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
  },
  price: {
    color: '#6fff76',
    fontWeight: 'bold',
    fontSize: 15,
    textAlign: 'center',
  },
  quantity: {
    marginTop: 8,
    color: '#aaa',
    fontSize: 13,
    fontStyle: 'italic',
  },
  trashIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderRadius: 20,
    padding: 4,
  },
  submitButton: {
    position: 'absolute',
    bottom: 60,
    left: 20,
    right: 20,
    backgroundColor: '#F9227F',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 4,
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
