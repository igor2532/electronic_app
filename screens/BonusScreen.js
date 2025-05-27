//#
import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import BonusBalance from '../components/BonusBalance';
import BonusQRCode from '../components/BonusQRCode';
import { MyContext } from '../navigation/Context';
import { api } from '../utils/api';

export default function BonusScreen() {
  const { user } = useContext(MyContext);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    api.getBonus(user.user_id).then(setBalance).catch(() => setBalance(0));
  }, []);

  return (
    <View style={styles.container}>
      <BonusBalance balance={balance} />
      <Text style={styles.qrTitle}>Покажите этот QR-код кассиру</Text>
      <BonusQRCode value={user.user_id} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', paddingTop: 30 },
  qrTitle: { marginTop: 22, marginBottom: 8, fontSize: 15, color: '#333' },
});
