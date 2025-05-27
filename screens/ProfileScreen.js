import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { MyContext } from '../navigation/Context';
import { getUserProfile } from '../utils/api';
import { Ionicons } from '@expo/vector-icons';

const colors = ['#F44336', '#E91E63', '#9C27B0', '#3F51B5', '#1976D2', '#009688', '#FF9800', '#FF5722', '#607D8B', '#388E3C'];

function getColorFromName(name) {
  // Возвращает цвет, не слишком светлый
  if (!name) return colors[0];
  const code = name.charCodeAt(0);
  return colors[code % colors.length];
}

export default function ProfileScreen({ navigation }) {
  const { user } = useContext(MyContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.user_id) {
      getUserProfile(user.user_id).then(setProfile).finally(() => setLoading(false));
    }
  }, [user]);

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" /></View>;

  const avatarColor = getColorFromName(profile?.billing_first_name);
  const initial = profile?.billing?.first_name?.[0]?.toUpperCase() || '?';
  const avatarSize = Math.floor(Dimensions.get('window').width * 0.3);

  return (
    <View style={styles.container}>
      <View style={[styles.avatarBlock, { backgroundColor: avatarColor, width: avatarSize, height: avatarSize, borderRadius: avatarSize / 6 }]}>
        <Text style={styles.avatarText}>{initial}</Text>
      </View>
      <View style={styles.profileInfo}>
        <Text style={styles.label}>Имя:</Text>
        <Text style={styles.value}>{profile?.billing?.first_name || '-'}</Text>

        <Text style={styles.label}>Фамилия:</Text>
        <Text style={styles.value}>{profile?.billing?.last_name || '-'}</Text>

        <Text style={styles.label}>Город:</Text>
        <Text style={styles.value}>{profile?.billing?.city || '-'}</Text>

        <Text style={styles.label}>Адрес:</Text>
        <Text style={styles.value}>{profile?.billing?.address_1 || '-'}</Text>

        <Text style={styles.label}>Телефон:</Text>
        <Text style={styles.value}>{profile?.billing?.phone || '-'}</Text>

        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{profile?.email || '-'}</Text>
      </View>
      <TouchableOpacity style={styles.editBtn} onPress={() => navigation.navigate('EditProfileScreen', { profile })}>
        <Ionicons name="create-outline" size={20} color="#fff" />
        <Text style={styles.editBtnText}>Редактировать</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', paddingTop: 32, backgroundColor: '#f9f9f9' },
  avatarBlock: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
    alignSelf: 'center',
    marginTop: 29,
    elevation: 3
  },
  avatarText: {
    color: '#fff',
    fontSize: 60,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  profileInfo: { width: '90%', marginTop: 10 },
  label: { color: '#aaa', fontSize: 15, marginTop: 12 },
  value: { fontWeight: 'bold', fontSize: 19, color: '#222', marginTop: 1 },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#d70022',
    borderRadius: 11,
    paddingHorizontal: 28,
    paddingVertical: 13,
    marginTop: 35,
    elevation: 2
  },
  editBtnText: {
    color: '#fff', fontWeight: 'bold', fontSize: 17, marginLeft: 7, textTransform: 'uppercase', letterSpacing: 0.7
  },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' }
});
