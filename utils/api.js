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
// export const getNews = async () => {
//   const res = await fetch(`${WP_SITE_URL}/wp-json/wp/v2/posts?categories=скидка`);
//   return await res.json();
// };

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

export const getUserProfile = async (user_id) => {
  // WooCommerce REST API (можно через wp-json/wc/v3/customers/{id})
  const res = await axios.get(`${WC_API_URL}/customers/${user_id}`, {
    auth: {
      username: WC_CONSUMER_KEY,
      password: WC_CONSUMER_SECRET,
    },
  });
  return res.data;
};

export const updateUserProfile = async ({ user_id, first_name, last_name, city, address, phone }) => {
  const form = new FormData();
  form.append('action', 'app_update_profile');
  form.append('user_id', user_id);
  form.append('first_name', first_name);
  form.append('last_name', last_name);
  form.append('city', city);
  form.append('address', address);
  form.append('phone', phone);

  const res = await fetch(`${WP_SITE_URL}/wp-admin/admin-ajax.php`, {
    method: 'POST',
    body: form,
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.data || 'Ошибка');
  return data.data;
};



//send request
export const sendProductRequest = async ({ user, products }) => {
  const form = new FormData();
  form.append('action', 'app_product_request');
  form.append('user', JSON.stringify(user));
  form.append('products', JSON.stringify(products));

  const res = await fetch(`${WP_SITE_URL}/wp-admin/admin-ajax.php`, {
    method: 'POST',
    body: form,
  });

  const data = await res.json();
  if (!data.success) throw new Error(data.data || 'Ошибка отправки заявки');
  return data;
};


//send sms auth


export const sendSmsCode = async (phone) => {
  const res = await fetch(`${WP_SITE_URL}/wp-json/myplugin/v1/send-code/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone }),
  });
  return await res.json();
};

export const verifySmsCode = async (phone, code) => {
  const res = await fetch(`${WP_SITE_URL}/wp-json/myplugin/v1/verify-code/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, code }),
  });
  return await res.json();
};


//новости
export const getNews = async () => {
  const res = await fetch(`${WP_SITE_URL}/wp-json/wp/v2/posts?categories=2977&_embed&per_page=20`);
  return await res.json();
};