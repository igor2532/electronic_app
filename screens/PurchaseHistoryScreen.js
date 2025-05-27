//#
import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MyContext } from '../navigation/Context';
import { api } from '../utils/api';
import PurchaseList from '../components/PurchaseList';

export default function PurchaseHistoryScreen({ navigation }) {
  const { user } = useContext(MyContext);
  const [purchases, setPurchases] = useState([]);

  useEffect(() => {
    api.getPurchases(user.user_id)
      .then(setPurchases)
      .catch(() => setPurchases([]));
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>История покупок</Text>
      <PurchaseList purchases={purchases} onItemPress={(item) => navigation.navigate('Детали покупки', { id: item.id })} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 18, backgroundColor: '#fff' },
  header: { fontSize: 21, fontWeight: 'bold', marginBottom: 16 },
});
