import { useState, useEffect } from 'react';

import api from '../../services/api';
import history from '../../services/history';

export default function useAuth() {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      api.defaults.headers.Authorization = `Bearer ${JSON.parse(token)}`;
      setAuthenticated(true);
    }

    setLoading(false);
  }, []);

  async function handleLogin(e, username, password) {
    e.preventDefault();

    try {
      const { data } = await api.post('/users/login', { username, password });
      localStorage.setItem('token', JSON.stringify(data.access_token));
      localStorage.setItem('user', JSON.stringify(data.user));
      api.defaults.headers.Authorization = `Bearer ${data.access_token}`;
      api.defaults.withCredentials = true;
      setAuthenticated(true);
      history.push('/dashboard');
    } catch (error) {
      console.log('Ooops! Houve um error.', error.message || error);
      return;
    }
  }

  function handleLogout() {
    setAuthenticated(false);
    localStorage.clear();
    api.defaults.headers.Authorization = undefined;

    history.push('/login');
  }

  return { authenticated, loading, handleLogin, handleLogout };
}
