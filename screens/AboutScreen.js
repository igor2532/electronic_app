import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Linking } from 'react-native';

export default function AboutScreen({ navigation }) {
  React.useEffect(() => {
    navigation.setOptions({ title: 'Контакты' });
  }, []);

  return (
    <ScrollView style={styles.root} contentContainerStyle={{ alignItems: 'center', paddingBottom: 32 }}>
      <Image style={styles.img} source={require('../assets/td.jpg')} />
      <Text style={styles.desc}>
        Розничная торговля бытовой техникой и электроникой, электроинструментом, мотоблоками, мотоциклами и др.
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Режим работы:</Text>
        {[
          'Понедельник: 10:00–18:00',
          'Вторник: 10:00–18:00',
          'Среда: 10:00–18:00',
          'Четверг: 10:00–18:00',
          'Пятница: 10:00–18:00',
          'Суббота: 10:00–18:00',
          'Воскресенье: 10:00–18:00',
        ].map((d) => (
          <Text style={styles.time} key={d}>{d}</Text>
        ))}
      </View>

      <TouchableOpacity
        style={styles.phoneBtn}
        onPress={() => Linking.openURL('tel:+375292898098')}
        activeOpacity={0.87}
      >
        <Text style={styles.phoneBtnText}>+375 (29) 289-80-98</Text>
      </TouchableOpacity>

      <View style={styles.infoBlock}>
        <Text style={styles.orgTitle}>ЧТУП "ТЕХНОИВЬЕ"</Text>
        <Text style={styles.infoText}>
          г. Ивье, ул. Красноармейская, д. 2, каб. 15{'\n'}
          УНП 590191596,{'\n'}
          Регистрационный номер в торговом реестре РБ 333340.{'\n'}
          Сведения внесены 11.10.017 г.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#191B22' },
  img: {
    width: '95%',
    height: 190,
    borderRadius: 16,
    marginTop: 22,
    marginBottom: 18,
    resizeMode: 'cover',
    alignSelf: 'center',
    backgroundColor: '#23262F',
  },
  desc: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 18,
    marginHorizontal: 10,
    fontWeight: '400',
  },
  card: {
    width: '92%',
    backgroundColor: '#23262F',
    borderRadius: 18,
    padding: 18,
    marginBottom: 18,
    elevation: 2,
    alignItems: 'center',
  },
  cardTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  time: {
    color: '#fff',
    fontSize: 15.5,
    marginBottom: 2,
    letterSpacing: 0.2,
  },
  phoneBtn: {
    backgroundColor: '#F9227F',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 45,
    marginBottom: 16,
    elevation: 3,
    width: '92%',
    alignSelf: 'center',
  },
  phoneBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 19,
    letterSpacing: 0.8,
  },
  infoBlock: {
    width: '92%',
    backgroundColor: '#23262F',
    borderRadius: 16,
    padding: 17,
    marginBottom: 24,
    alignItems: 'center',
    elevation: 1,
  },
  orgTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16.5,
    marginBottom: 7,
    textAlign: 'center',
  },
  infoText: {
    color: '#b0b0b0',
    fontSize: 14.5,
    textAlign: 'center',
    letterSpacing: 0.05,
    fontWeight: '400',
  },
});
