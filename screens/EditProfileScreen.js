import React, { useContext, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView, Dimensions, KeyboardAvoidingView, Platform } from 'react-native';
import { updateUserProfile } from '../utils/api';
import { Picker } from '@react-native-picker/picker';
import DropDownPicker from 'react-native-dropdown-picker';
import { MyContext } from '../navigation/Context';
 
const CITIES = [
    { label: 'Лида', value: 'Лида' },
    { label: 'Ивье', value: 'Ивье' },
    { label: 'Гродно', value: 'Гродно' },
    { label: 'Минск', value: 'Минск' },
    { label: 'Волковыск', value: 'Волковыск' },
    { label: 'Новогрудок', value: 'Новогрудок' },
    { label: 'Слоним', value: 'Слоним' },
    // ... добавь свои города
];

export default function EditProfileScreen({ route, navigation }) {
    const { setUser, user } = useContext(MyContext);
    const initProfile = route.params.profile;
    const [firstName, setFirstName] = useState(initProfile?.billing?.first_name || '');
    const [lastName, setLastName] = useState(initProfile?.billing?.last_name || '');
    const [city, setCity] = useState(initProfile?.billing?.city || CITIES[0].value);
    const [open, setOpen] = useState(false);
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
            setUser({
                ...user,
                billing: {
                    ...user.billing,
                    first_name: firstName,
                    last_name: lastName,
                    city,
                    address_1: address,
                    phone,
                }
            });


            setMessage('Сохранено!');
            setTimeout(() => navigation.goBack(), 700);
        } catch (e) {
            setMessage('Ошибка сохранения');
        }
        setSaving(false);
    };

    const avatarColor = '#F9227F';
    const avatarSize = Math.floor(Dimensions.get('window').width * 0.3);

    return (
        <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === "ios" ? "padding" : undefined}>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={[styles.avatarBlock, { backgroundColor: avatarColor, width: avatarSize, height: avatarSize, borderRadius: avatarSize / 6 }]}>
                    <Text style={styles.avatarText}>{firstName?.[0]?.toUpperCase() || '?'}</Text>
                </View>
                <View style={styles.form}>
                    <Text style={styles.label}>Имя</Text>
                    <TextInput style={styles.input} value={firstName} onChangeText={setFirstName} placeholder="Имя" placeholderTextColor="#888" />

                    <Text style={styles.label}>Фамилия</Text>
                    <TextInput style={styles.input} value={lastName} onChangeText={setLastName} placeholder="Фамилия" placeholderTextColor="#888" />

                    <Text style={styles.label}>Город</Text>
                    <DropDownPicker
                        open={open}
                        value={city}
                        items={CITIES}
                        setOpen={setOpen}
                        setValue={setCity}
                        placeholder="Выберите город"
                        style={styles.dropdown}
                        textStyle={styles.dropdownText}
                        dropDownContainerStyle={styles.dropdownList}
                        placeholderStyle={{ color: "#aaa" }}
                        listItemLabelStyle={{ color: "#fff" }}
                        theme="DARK"
                        zIndex={1000}
                    />

                    <Text style={styles.label}>Адрес</Text>
                    <TextInput style={styles.input} value={address} onChangeText={setAddress} placeholder="Адрес" placeholderTextColor="#888" />

                    <Text style={styles.label}>Телефон</Text>
                    <TextInput style={styles.input} value={phone} keyboardType="phone-pad" onChangeText={setPhone} placeholder="Телефон" placeholderTextColor="#888" />

                    <TouchableOpacity
                        style={styles.saveBtn}
                        onPress={handleSave}
                        disabled={saving}
                        activeOpacity={0.86}
                    >
                        {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveBtnText}>Сохранить</Text>}
                    </TouchableOpacity>
                    {message ? <Text style={styles.message}>{message}</Text> : null}
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: '#191B22' },
    container: { alignItems: 'center', padding: 18, backgroundColor: '#191B22', minHeight: '100%' },
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
    label: { color: '#aaa', fontSize: 15, marginTop: 12, marginBottom: 1 },
    input: {
        borderColor: '#23262F',
        borderWidth: 1.2,
        borderRadius: 10,
        padding: 13,
        backgroundColor: '#23262F',
        marginTop: 3,
        fontSize: 17,
        color: '#fff'
    },
    pickerWrap: {
        borderColor: '#23262F',
        borderWidth: 1.2,
        borderRadius: 10,
        marginTop: 3,
        backgroundColor: '#23262F',
        height: 55,
        justifyContent: 'center',
    },
    picker: {
        width: '100%',
        height: 50,
        fontSize: 17,
        color: '#fff',
        backgroundColor: '#23262F',
    },
    saveBtn: {
        marginTop: 28,
        backgroundColor: '#F9227F', // ярко-розовая/красная кнопка
        borderRadius: 11,
        paddingVertical: 13,
        alignItems: 'center'
    },
    saveBtnText: {
        color: '#fff', fontWeight: 'bold', fontSize: 17, textTransform: 'uppercase', letterSpacing: 0.7
    },
    message: { marginTop: 14, textAlign: 'center', color: '#6fff76', fontSize: 16 },
});
