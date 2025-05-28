import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { MyContext } from '../navigation/Context';
import { WP_SITE_URL } from '@env';

export default function AuthComponent({ navigation }) {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { setUser } = useContext(MyContext);

  useFocusEffect(
    React.useCallback(() => {
      setEmail('');
      setCode('');
      setStep(1);
      setLoading(false);
      setMessage('');
    }, [])
  );

  const handleSendCode = async () => {
    setLoading(true);
    setMessage('');
    try {
      const form = new FormData();
      form.append('action', 'app_send_code');
      form.append('email', email);
      const res = await fetch(`${WP_SITE_URL}/wp-admin/admin-ajax.php`, {
        method: 'POST',
        body: form,
      });
      const data = await res.json();
      if (data.success) {
        setStep(2);
        setMessage('Код отправлен на email');
      } else {
        setMessage(data.data || 'Ошибка отправки');
      }
    } catch (e) {
      setMessage('Ошибка сети');
    }
    setLoading(false);
  };

  const handleCheckCode = async () => {
    setLoading(true);
    setMessage('');
    try {
      const form = new FormData();
      form.append('action', 'app_check_code');
      form.append('email', email);
      form.append('code', code);
      const res = await fetch(`${WP_SITE_URL}/wp-admin/admin-ajax.php`, {
        method: 'POST',
        body: form,
      });
      const data = await res.json();
      if (data.success) {
        setUser({ user_id: data.data.user_id, email: data.data.email });
        setMessage('Вы авторизованы!');
        setTimeout(() => navigation.navigate('Главная'), 700);
      } else {
        setMessage(data.data || 'Неверный код');
      }
    } catch (e) {
      setMessage('Ошибка сети');
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Авторизация по email</Text>
      {step === 1 && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Email"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            editable={!loading}
            placeholderTextColor="#888"
          />
          <TouchableOpacity
            style={[styles.button, (!email || loading) && styles.buttonDisabled]}
            onPress={handleSendCode}
            disabled={!email || loading}
            activeOpacity={0.8}
          >
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Получить код</Text>}
          </TouchableOpacity>
        </>
      )}
      {step === 2 && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Введите код из email"
            keyboardType="number-pad"
            value={code}
            onChangeText={setCode}
            editable={!loading}
            placeholderTextColor="#888"
          />
          <TouchableOpacity
            style={[styles.button, (!code || loading) && styles.buttonDisabled]}
            onPress={handleCheckCode}
            disabled={!code || loading}
            activeOpacity={0.8}
          >
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Войти</Text>}
          </TouchableOpacity>
        </>
      )}
      {!!message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: 'flex-start', padding: 26, backgroundColor: '#191B22'
  },
  header: {
    fontWeight: 'bold', fontSize: 23, marginTop: 28, marginBottom: 28, color: '#fff', alignSelf: 'center', letterSpacing: 0.3
  },
  input: {
    borderColor: '#23262F',
    borderWidth: 1.2,
    padding: 15,
    borderRadius: 15,
    marginBottom: 18,
    backgroundColor: '#23262F',
    fontSize: 17,
    color: '#fff',
    shadowColor: '#23262F',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.09,
    shadowRadius: 6,
    elevation: 1,
  },
  button: {
    backgroundColor: '#F9227F',
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 2,
    elevation: 2,
    marginBottom: 10,
    shadowColor: '#F9227F55',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.19,
    shadowRadius: 10,
  },
  buttonDisabled: {
    backgroundColor: '#484758',
  },
  buttonText: {
    color: '#fff', fontWeight: 'bold', fontSize: 17, letterSpacing: 0.7, textTransform: 'uppercase'
  },
  message: {
    marginTop: 19, color: '#6fff76', fontSize: 15, textAlign: 'center', minHeight: 25, fontWeight: 'bold'
  },
});
