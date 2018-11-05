import * as api from './api';

export const login = async (username, password) => {
  const result = await api.login(username, password);
  if (result.error) {
    return false;
  }

  localStorage.setItem('token', result.token);
  return true;
};

export const isLogin = () => {
  const token = localStorage.getItem('token');
  if (token.length === 0) {
    return false;
  }

  // TODO: verify
  return true;
};

