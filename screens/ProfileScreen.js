import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ActivityIndicator, ScrollView } from 'react-native';
import { MyContext } from '../navigation/Context';
import { getUserProfile } from '../utils/api';
import { Ionicons } from '@expo/vector-icons';

const colors = ['#F9227F', '#1E90FF', '#1976D2', '#9C27B0', '#FF9800', '#43a047', '#607D8B', '#3F51B5'];

function getColorFromName(name) {
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

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#F9227F" /></View>;

  const avatarColor = getColorFromName(profile?.billing?.first_name);
  const initial = profile?.billing?.first_name?.[0]?.toUpperCase() || '?';
  const avatarSize = Math.floor(Dimensions.get('window').width * 0.3);

  // Массив для отображения всех полей профиля
  const items = [
    { label: 'Имя', value: profile?.billing?.first_name },
    { label: 'Фамилия', value: profile?.billing?.last_name },
    { label: 'Город', value: profile?.billing?.city },
    { label: 'Адрес', value: profile?.billing?.address_1 },
    { label: 'Телефон', value: profile?.billing?.phone },
    { label: 'Email', value: profile?.email }
  ];

  return (
    <ScrollView style={styles.scrollRoot} contentContainerStyle={{ alignItems: 'center', paddingBottom: 80, paddingTop:30 }}>
      <View style={[styles.avatarBlock, { backgroundColor: avatarColor, width: avatarSize, height: avatarSize, borderRadius: avatarSize / 6 }]}>
        <Text style={styles.avatarText}>{initial}</Text>
      </View>
      <View style={styles.fieldsWrap}>
        {items.map((item, idx) => (
          <View key={item.label} style={styles.fieldBlock}>
            <Text style={styles.fieldLabel}>{item.label}</Text>
            <Text style={styles.fieldValue}>{item.value || '-'}</Text>
          </View>
        ))}
      </View>
      <TouchableOpacity style={styles.editBtn} onPress={() => navigation.navigate('EditProfileScreen', { profile })}>
        <Ionicons name="create-outline" size={20} color="#fff" />
        <Text style={styles.editBtnText}>Редактировать</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollRoot: { flex: 1, backgroundColor: '#191B22' },
  avatarBlock: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    alignSelf: 'center',
    marginTop: 29,
    elevation: 3,
    shadowColor: '#222',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.22,
    shadowRadius: 6,
  },
  avatarText: {
    color: '#fff',
    fontSize: 64,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  fieldsWrap: {
    width: '92%',
    marginTop: 4,
  },
  fieldBlock: {
    backgroundColor: '#23262F',
    borderRadius: 16,
    paddingVertical: 17,
    paddingHorizontal: 19,
    marginBottom: 15,
    flexDirection: 'column',
    elevation: 1,
  },
  fieldLabel: {
    color: '#bbb',
    fontSize: 15.5,
    marginBottom: 6,
    letterSpacing: 0.1,
  },
  fieldValue: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17,
    letterSpacing: 0.2,
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9227F',
    borderRadius: 13,
    paddingHorizontal: 30,
    paddingVertical: 15,
    marginTop: 20,
    elevation: 2,
  },
  editBtnText: {
    color: '#fff', fontWeight: 'bold', fontSize: 16.5, marginLeft: 8, textTransform: 'uppercase', letterSpacing: 0.7
  },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#191B22' }
});
