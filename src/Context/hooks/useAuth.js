import { useState, useEffect } from 'react';

import api from '../../services/api';
import history from '../../services/history';

export default function useAuth() {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({ 'error': '' });

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
      setErrors({ 'error': '' });
      history.push('/dashboard');
    } catch (error) {
      const { data } = error.response;
      console.log('Ooops! Houve um error.', error.message || error);
      setErrors({ 'error': data.detail });
      return;
    }
  }

  function handleLogout() {
    setAuthenticated(false);
    localStorage.clear();
    api.defaults.headers.Authorization = undefined;

    (function () {
      var cookies = document.cookie.split("; ");
      for (var c = 0; c < cookies.length; c++) {
        var d = window.location.hostname.split(".");
        while (d.length > 0) {
          var cookieBase = encodeURIComponent(cookies[c].split(";")[0].split("=")[0]) + '=; expires=Thu, 01-Jan-1970 00:00:01 GMT; domain=' + d.join('.') + ' ;path=';
          var p = window.location.pathname.split('/');
          document.cookie = cookieBase + '/';
          while (p.length > 0) {
            document.cookie = cookieBase + p.join('/');
            p.pop();
          };
          d.shift();
        }
      }
    })();

    history.push('/login');
  }

  return { authenticated, loading, handleLogin, handleLogout, errors };
}
