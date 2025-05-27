import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView, Dimensions } from 'react-native';
import { updateUserProfile } from '../utils/api';
import { Picker } from '@react-native-picker/picker';
const CITIES = [
    'Лида', 'Ивье', 'Гродно', 'Минск', 'Волковыск', 'Новогрудок', 'Слоним'
    // ...дополни сам
];

export default function EditProfileScreen({ route, navigation }) {
    const initProfile = route.params.profile;
    const [firstName, setFirstName] = useState(initProfile?.billing?.first_name || '');
    const [lastName, setLastName] = useState(initProfile?.billing?.last_name || '');
    const [city, setCity] = useState(initProfile?.billing?.city || CITIES[0]);
    const [address, setAddress] = useState(initProfile?.billing?.address_1 || '');
    const [phone, setPhone] = useState(initProfile?.billing?.phone || '');
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    const handleSave = async () => {
        setSaving(true);
        setMessage('');
        try {
            await updateUserProfile({
                user_id: initProfile.id,
                first_name: firstName,
                last_name: lastName,
                city,
                address,
                phone
            });
            setMessage('Сохранено!');
            setTimeout(() => navigation.goBack(), 700);
        } catch (e) {
            setMessage('Ошибка сохранения');
        }
        setSaving(false);
    };

    const avatarColor = '#d70022';
    const avatarSize = Math.floor(Dimensions.get('window').width * 0.3);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={[styles.avatarBlock, { backgroundColor: avatarColor, width: avatarSize, height: avatarSize, borderRadius: avatarSize / 6 }]}>
                <Text style={styles.avatarText}>{firstName?.[0]?.toUpperCase() || '?'}</Text>
            </View>
            <View style={styles.form}>
                <Text style={styles.label}>Имя</Text>
                <TextInput style={styles.input} value={firstName} onChangeText={setFirstName} />

                <Text style={styles.label}>Фамилия</Text>
                <TextInput style={styles.input} value={lastName} onChangeText={setLastName} />

                <Text style={styles.label}>Город</Text>
                <View style={styles.pickerWrap}>
                    <Picker
                        selectedValue={city}
                        onValueChange={setCity}
                        style={styles.picker}
                        itemStyle={{ fontSize: 17 }}
                    >
                        {CITIES.map((c) => <Picker.Item key={c} label={c} value={c} />)}
                    </Picker>
                </View>

                <Text style={styles.label}>Адрес</Text>
                <TextInput style={styles.input} value={address} onChangeText={setAddress} />

                <Text style={styles.label}>Телефон</Text>
                <TextInput style={styles.input} value={phone} keyboardType="phone-pad" onChangeText={setPhone} />

                <TouchableOpacity
                    style={styles.saveBtn}
                    onPress={handleSave}
                    disabled={saving}
                >
                    {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveBtnText}>Сохранить</Text>}
                </TouchableOpacity>
                {message ? <Text style={styles.message}>{message}</Text> : null}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { alignItems: 'center', padding: 18, backgroundColor: '#f9f9f9' },
    avatarBlock: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 25,
        alignSelf: 'center',
        marginTop: 18,
        elevation: 3
    },
    avatarText: {
        color: '#fff',
        fontSize: 60,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    form: { width: '96%', marginTop: 10 },
    label: { color: '#aaa', fontSize: 15, marginTop: 12 },
    input: { borderColor: '#ddd', borderWidth: 1, borderRadius: 10, padding: 12, backgroundColor: '#fff', marginTop: 3, fontSize: 17 },
    pickerWrap: { borderColor: '#ddd', borderWidth: 1, borderRadius: 10, marginTop: 3, backgroundColor: '#fff' },
    picker: { width: '100%', height: 44 },
    saveBtn: { marginTop: 28, backgroundColor: '#1976D2', borderRadius: 11, paddingVertical: 13, alignItems: 'center' },
    saveBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 17, textTransform: 'uppercase' },
    message: { marginTop: 14, textAlign: 'center', color: '#43a047', fontSize: 16 },
    pickerWrap: {
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 10,
        marginTop: 3,
        backgroundColor: '#fff',
        height: 55, // добавь! Можно 44-52
        justifyContent: 'center',
    },
    picker: {
        width: '100%',
        height: 50, // добавь!
        fontSize: 17,
    },
});
