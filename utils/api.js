import axios from 'axios';
import { WP_SITE_URL, WC_API_URL, WC_CONSUMER_KEY, WC_CONSUMER_SECRET } from '@env';

export const api = axios.create({
  baseURL: WC_API_URL,
  auth: {
    username: WC_CONSUMER_KEY,
    password: WC_CONSUMER_SECRET,
  },
});

// ========== WordPress AJAX (fetch) ==========
export const wpAjax = async (action, params = {}) => {
  const form = new FormData();
  form.append('action', action);
  Object.keys(params).forEach(key => form.append(key, params[key]));
  const res = await fetch(`${WP_SITE_URL}/wp-admin/admin-ajax.php`, {
    method: 'POST',
    body: form,
  });
  return await res.json();
};

// ========== Авторизация/Регистрация ==========
export const registerOrGetUser = async (email) => {
  const data = await wpAjax('app_register', { email });
  if (!data.success) throw new Error(data.data || 'Ошибка регистрации/авторизации');
  return data.data.user_id;
};

// ========== Получить бонусы ==========
export const getBonus = async (user_id) => {
  const data = await wpAjax('app_get_bonus', { user_id });
  return data.data.points;
};

// ========== История покупок через WooCommerce ==========
export const getPurchases = async (user_id) => {
  const res = await api.get(`/orders?customer=${user_id}`);
  return res.data;
};

// ========== Детализация покупки ==========
export const getPurchaseDetails = async (order_id) => {
  const res = await api.get(`/orders/${order_id}`);
  return res.data;
};

// ========== Списание бонусов (QR-касса) ==========
export const redeemBonus = async (user_id) => {
  const data = await wpAjax('app_redeem_bonus', { user_id });
  if (!data.success) throw new Error(data.data || 'Ошибка при списании бонусов');
  return data.data;
};

// ========== Получить новости/акции ==========
export const getNews = async () => {
  const res = await fetch(`${WP_SITE_URL}/wp-json/wp/v2/posts?categories=скидка`);
  return await res.json();
};

// ========== Поиск ==========
export const search = async (q) => {
  const res = await fetch(`${WP_SITE_URL}/wp-json/wp/v2/posts?search=${encodeURIComponent(q)}`);
  return await res.json();
};

// ========== Получить клиентов (только для админа) ==========
export const getClients = async () => {
  const res = await fetch(`${WP_SITE_URL}/wp-json/wp/v2/users`);
  return await res.json();
};
