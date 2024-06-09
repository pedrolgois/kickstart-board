import axios from 'axios';
import { createPinia as _createPinia } from 'pinia';

export const createPinia = () => {
  return _createPinia();
};

export * from './store';

export const kickStartBoardAPI = axios.create({
  baseURL: 'https://66638e31932baf9032a87f83.mockapi.io',
})
