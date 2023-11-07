import { SESSION } from '../app/lib/constants';

export const unsetLocalStorage = () => (localStorage.clear());

export const getLocalStorage = (key) => {
  const getStorage = localStorage.getItem(key);
  try {
    return getStorage ? atob(getStorage) : false;
  } catch (e) {
    return false;
  }
};

export const getAuthToken = () => localStorage.getItem(SESSION.TOKEN) || '';

export const getUserData = () => {
  if (getAuthToken()) {
    const userDetail = jwt_decode(getAuthToken());// eslint-disable-line
    return userDetail;
  }
  return null;
};

export const handleSessionExpiration = (error) => {
  if (error && error.response && error.response.data) {
    const respData = error.response.data;
    if (
      respData.status === SESSION.EXPIRED
      || respData.code === SESSION.EXPIRED_ERROR_CODE
      || error.response.status === 401
    ) {
      unsetLocalStorage();
      window.location.href = '/login';
    }
  }
};