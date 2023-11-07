import axios from 'axios';
import _ from 'lodash';
import { handleSessionExpiration, getAuthToken } from '../utils/helpers.js';
import { HEADER, ERROR } from '../app/lib/constants';
const API = axios.create({
  headers: {
    'Content-Type': HEADER.CONTENT_TYPE
  },
  timeout: HEADER.TIMEOUT
});

API.interceptors.request.use((config) => {
  if (getAuthToken() !== '') {
    _.merge(config.headers, {
      [`${'Authorization'}`]: `Basic ${getAuthToken()}`,
    });
  }
  return config;
}, (err) => Promise.reject(err));

API.interceptors.response.use(
  response => {
    if (typeof response.data !== 'object') {
      return Promise.error({ message: ERROR.INVALID_RESPONSE });
    }
    return response.data;
  },
  error => {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    handleSessionExpiration(error);
    return Promise.reject(error);
  }
);

export default API;