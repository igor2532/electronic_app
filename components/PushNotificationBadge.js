//#
import React from 'react';
import { FlatList, TouchableOpacity } from 'react-native';
import PurchaseItem from './PurchaseItem';

export default function PurchaseList({ purchases, onItemPress }) {
  return (
    <FlatList
      data={purchases}
      keyExtractor={item => item.id.toString()}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => onItemPress(item)}>
          <PurchaseItem item={item} />
        </TouchableOpacity>
      )}
    />
  );
}
