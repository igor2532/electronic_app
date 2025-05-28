import React from 'react';
import { View, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function FooterBar() {
  const navigation = useNavigation();

  return (
    <View style={styles.footer}>
      <TouchableOpacity
        onPress={() => {
          if (navigation.openDrawer) navigation.openDrawer();
          else navigation.navigate('Главная');
        }}
        style={styles.icon}
      >
        <Ionicons name="menu" size={32} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('SearchScreen')} style={styles.icon}>
        <Ionicons name="search" size={32} color="#fff" />
      </TouchableOpacity>
  
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    backgroundColor: '#191B22',
    paddingVertical: 10,
    justifyContent: 'space-around',
    alignItems: 'center',
  
    elevation: 8,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  icon: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
});
