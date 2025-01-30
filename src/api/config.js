// API temel URL'si
export const API_BASE_URL = 'http://127.0.0.1:8000';

// API endpoint'leri
export const ENDPOINTS = {
  // Auth endpoints
  LOGIN: '/users/login/',
  LOGOUT: '/users/logout/',
  // User endpoints
  CREATE_USER: '/users/create-user/',
  GET_USERS: '/users/users/',
  // Notification endpoints
  CREATE_NOTIFICATION: '/notifications/create/',
  GET_NOTIFICATIONS: '/notifications/',
  // Area endpoints
  CREATE_AREA: '/regions/create/',
  GET_AREAS: '/regions/',
  // // Patient endpoints
  // PATIENTS: '/patients/',
  // PATIENT_DETAIL: (id) => `/patients/${id}/`,
};

// API istekleri için varsayılan ayarlar
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
};
