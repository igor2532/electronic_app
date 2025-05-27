//#
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function PurchaseItem({ item }) {
  return (
    <View style={styles.item}>
      <Text style={styles.date}>{item.date_created?.slice(0, 10)}</Text>
      <Text style={styles.name}>Сумма: {item.total} BYN</Text>
      <Text style={styles.bonus}>+{item.bonus_earned || 0} баллов</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  item: { padding: 14, backgroundColor: '#f5f5f5', borderRadius: 8, marginBottom: 10 },
  date: { color: '#555', marginBottom: 4 },
  name: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  bonus: { color: '#43a047', fontWeight: 'bold', marginTop: 3 },
});
