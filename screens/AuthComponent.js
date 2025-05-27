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

  // Сбросить все состояния при каждом показе экрана
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
            placeholderTextColor="#bbb"
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
            placeholderTextColor="#bbb"
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
  container: { flex: 1, justifyContent: 'flex-start', padding: 28, backgroundColor: '#fafcff' },
  header: { fontWeight: 'bold', fontSize: 22, marginBottom: 26, color: '#2a2d34', alignSelf: 'center' },
  input: {
    borderColor: '#d4dae3',
    borderWidth: 1,
    padding: 12,
    borderRadius: 12,
    marginBottom: 18,
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#222'
  },
  button: {
    backgroundColor: '#ff3d00',
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 2,
    elevation: 2,
    marginBottom: 10
  },
  buttonDisabled: {
    backgroundColor: '#ffab91',
  },
  buttonText: {
    color: '#fff', fontWeight: 'bold', fontSize: 16, letterSpacing: 0.7, textTransform: 'uppercase'
  },
  message: {
    marginTop: 18, color: '#009688', fontSize: 15, textAlign: 'center', minHeight: 25
  },
});
