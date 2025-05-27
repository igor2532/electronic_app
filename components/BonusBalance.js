//#
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function BonusBalance({ balance }) {
  return (
    <View style={styles.block}>
      <Text style={styles.title}>Ваши бонусы</Text>
      <Text style={styles.balance}>{balance} баллов</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  block: { alignItems: 'center', marginVertical: 20, padding: 16, backgroundColor: '#f1f8e9', borderRadius: 14, elevation: 1 },
  title: { fontSize: 17, fontWeight: 'bold', marginBottom: 6 },
  balance: { fontSize: 32, fontWeight: 'bold', color: '#4caf50' },
});
