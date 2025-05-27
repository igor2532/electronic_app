//#
import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { MyContext } from '../navigation/Context';
import { api } from '../utils/api';

export default function ScanQRScreen() {
  const { user } = useContext(MyContext);
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [info, setInfo] = useState('');

  useEffect(() => {
    BarCodeScanner.requestPermissionsAsync().then(({ status }) => setHasPermission(status === 'granted'));
  }, []);

  const handleBarCodeScanned = async ({ data }) => {
    setScanned(true);
    setInfo('Проверка...');
    // data — user_id клиента
    try {
      await api.redeemBonus(data); // свой метод в api.js
      setInfo('Бонусы успешно списаны!');
    } catch (err) {
      setInfo('Ошибка: ' + err.message);
    }
  };

  if (hasPermission === null) return <Text>Запрос разрешения на камеру...</Text>;
  if (hasPermission === false) return <Text>Нет доступа к камере</Text>;
  if (user?.role !== 'admin') return <Text>Нет доступа</Text>;

  return (
    <View style={{ flex: 1 }}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      {scanned && <Button title={'Сканировать снова'} onPress={() => { setScanned(false); setInfo(''); }} />}
      <Text style={styles.info}>{info}</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  info: { position: 'absolute', bottom: 80, left: 0, right: 0, color: '#111', textAlign: 'center', fontSize: 18 }
});
