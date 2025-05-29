import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { MyContext } from '../navigation/Context';
import { WP_SITE_URL } from '@env';

export default function AuthComponent({ navigation }) {
  const [method, setMethod] = useState('email'); // 'email' | 'sms'
  const [value, setValue] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { setUser } = useContext(MyContext);

  useFocusEffect(
    React.useCallback(() => {
      setValue('');
      setCode('');
      setStep(1);
      setLoading(false);
      setMessage('');
    }, [])
  );

  const sendCode = async () => {
    setLoading(true);
    setMessage('');
    try {
      const form = new FormData();
      form.append('action', method === 'email' ? 'app_send_code' : 'app_send_sms');
      form.append(method, value);
      const res = await fetch(`${WP_SITE_URL}/wp-admin/admin-ajax.php`, {
        method: 'POST',
        body: form,
      });
      const data = await res.json();
      if (data.success) {
        setStep(2);
        setMessage(`Код отправлен на ${method === 'email' ? 'email' : 'телефон'}`);
      } else {
        setMessage(data.data || 'Ошибка отправки');
      }
    } catch (e) {
      setMessage('Ошибка сети');
    }
    setLoading(false);
  };

  const checkCode = async () => {
    setLoading(true);
    setMessage('');
    try {
      const form = new FormData();
      form.append('action', method === 'email' ? 'app_check_code' : 'app_check_sms');
      form.append(method, value);
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
      <Text style={styles.header}>Авторизация</Text>

      <View style={styles.switch}>
        <TouchableOpacity
          onPress={() => setMethod('email')}
          style={[styles.switchBtn, method === 'email' && styles.switchActive]}>
          <Text style={styles.switchText}>Email</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setMethod('sms')}
          style={[styles.switchBtn, method === 'sms' && styles.switchActive]}>
          <Text style={styles.switchText}>СМС</Text>
        </TouchableOpacity>
      </View>

      {step === 1 && (
        <>
          <TextInput
            style={styles.input}
            placeholder={method === 'email' ? 'Email' : 'Телефон (+375...)'}
            keyboardType={method === 'email' ? 'email-address' : 'phone-pad'}
            value={value}
            onChangeText={setValue}
            editable={!loading}
            placeholderTextColor="#888"
          />
          <TouchableOpacity
            style={[styles.button, (!value || loading) && styles.buttonDisabled]}
            onPress={sendCode}
            disabled={!value || loading}
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
            placeholder="Код подтверждения"
            keyboardType="number-pad"
            value={code}
            onChangeText={setCode}
            editable={!loading}
            placeholderTextColor="#888"
          />
          <TouchableOpacity
            style={[styles.button, (!code || loading) && styles.buttonDisabled]}
            onPress={checkCode}
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
    fontWeight: 'bold', fontSize: 23, marginTop: 28, marginBottom: 28, color: '#fff', alignSelf: 'center'
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
  },
  button: {
    backgroundColor: '#F9227F',
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonDisabled: {
    backgroundColor: '#484758',
  },
  buttonText: {
    color: '#fff', fontWeight: 'bold', fontSize: 17
  },
  message: {
    marginTop: 19, color: '#6fff76', fontSize: 15, textAlign: 'center'
  },
  switch: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 10,
  },
  switchBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#2a2b32',
  },
  switchActive: {
    backgroundColor: '#1E90FF',
  },
  switchText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  }
});
