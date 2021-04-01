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
      api.defaults.withCredentials = true;
      setAuthenticated(true);
    }

    setLoading(false);
  }, []);

  async function handleLogin(e, username, password) {
    e.preventDefault();

    try {
      const { data } = await api.post('/users/login', { username, password });
      let cookie = data.access_token;
      localStorage.setItem('token', JSON.stringify(cookie));
      localStorage.setItem('user', JSON.stringify(data.user));
      api.defaults.headers.Authorization = `Bearer ${cookie}`;
      api.defaults.xsrfCookieName = 'csrftoken';
      api.defaults.xsrfHeaderName = 'X-CSRFToken';
      api.defaults.withCredentials = true;
      // document.cookie = `Set-Cookie: csrftoken=${cookie}; SameSite=lax`;
      createCookieInHour('csrftoken', cookie, 5);
      createCookieInHour('refreshtoken', cookie, 5);
      // setCookie('csrftoken', cookie, { path: '/', SameSite: 'None', secure: true, 'max-age': 3600 });

      setAuthenticated(true);
      setErrors({ 'error': '' });
      history.push('/dashboard');
    } catch (error) {
      const { data } = error.response
      console.log(error);
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

  const createCookieInHour = (cookieName, cookieValue, hourToExpire) => {
    let date = new Date();
    date.setTime(date.getTime() + (hourToExpire * 60 * 60 * 1000));
    document.cookie = cookieName + " = " + cookieValue + "; expires = " + date.toGMTString();
  }

  // function setCookie(name, value, options = {}) {

  //   if (options.expires instanceof Date) {
  //     options.expires = options.expires.toUTCString();
  //   }

  //   let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);

  //   for (let optionKey in options) {
  //     updatedCookie += "; " + optionKey;
  //     let optionValue = options[optionKey];
  //     if (optionValue !== true) {
  //       updatedCookie += "=" + optionValue;
  //     }
  //   }

  //   document.cookie = updatedCookie;
  // }

  return { authenticated, loading, handleLogin, handleLogout, errors };
}
