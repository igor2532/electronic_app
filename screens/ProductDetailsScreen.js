import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, Modal, Pressable, StyleSheet,Linking,ActivityIndicator,Button} from 'react-native';
import Swiper from 'react-native-swiper';
import { GestureHandlerRootView, PinchGestureHandler } from 'react-native-gesture-handler';
import {MyContext}  from '../navigation/Context';

export default function ProductDetailsScreen({ route,navigation }) {
  const { product } = route.params;
  const [modalVisible, setModalVisible] = useState(false);
  const [activeImage, setActiveImage] = useState(null);

  useEffect(()=>{
    navigation.setOptions({
      title: product.name,
    });
  },[])
 
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: 15 }}>
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
        </View>
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginVertical: 30 }}>{product.name}</Text>
        <Text style={{ fontSize: 26, color: 'green', marginBottom: 15 }}>{product.price} BYN</Text>
        <Text style={{ fontSize: 16, marginBottom: 10 }}>{product.description.replace(/<[^>]+>/g, '')}</Text>
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10,color:'black' }}>ЧТУП »ТЕХНОИВЬЕ»</Text>
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10,color:'#F00' }}>Рассрочка без переплат до 6 месяцев</Text>
        <Text style={{ fontSize: 15, fontWeight: 'bold', marginBottom: 10,color:'black' }}>г. Ивье, ул. Красноармейская, д. 2, каб. 15</Text>
      <View style={{paddingTop:15, paddingBottom:15}}><Button style={styles.aboutButton}
       title="+375 (29) 289-80-98" onPress={()=>{Linking.openURL('tel:+375 (29) 289-80-98');}} 
       color="#F00"
       accessibilityLabel="Позвонить"/></View>
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
});
