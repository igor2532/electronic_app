import React from 'react';
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function FooterBar() {
  const navigation = useNavigation();

  return (
    <View style={styles.floatingBar}>
      <TouchableOpacity
        onPress={() => {
          if (navigation.openDrawer) navigation.openDrawer();
          else navigation.navigate('Главная');
        }}
        style={styles.iconBtn}
      >
        <Ionicons name="menu-outline" size={26} color="#fff" />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('SearchScreen')} style={styles.iconBtn}>
        <Ionicons name="search-outline" size={26} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  floatingBar: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 30 : 20,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(42, 43, 50, 0.15)', // полупрозрачный
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 30,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    zIndex:2,
  },
  iconBtn: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
