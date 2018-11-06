import * as api from './api';

export const login = async (username, password) => {
  const result = await api.login(username, password);
  console.log(result);
  if (result.non_field_errors) {
    return false;
  }

  localStorage.setItem('token', result.token);
  return true;
};

export const isLogin = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    return false;
  }

  // TODO: verify
  return true;
};

export const logout = () => {
  localStorage.removeItem('token');
};
