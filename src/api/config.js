// API temel URL'si
// export const API_BASE_URL = 'http://127.0.0.1:8000';
export const API_BASE_URL = 'http://92.205.61.102:8001';

// API endpoint'leri
export const ENDPOINTS = {
  // Auth endpoints
  LOGIN: '/users/login/',
  LOGOUT: '/users/logout/',
  // User endpoints
  CREATE_USER: '/users/create-user/',
  GET_USERS: '/users/users/',
  UPDATE_USER: (id) => `/users/users/update/${id}/`,
  DELETE_USER: (id) => `/users/users/delete/${id}/`,
  // Notification endpoints
  CREATE_NOTIFICATION: '/notifications/create/',
  GET_NOTIFICATIONS: '/notifications/',
  // Area endpoints
  CREATE_AREA: '/regions/create/',
  GET_AREAS: '/regions/',
  UPDATE_AREA: (id) => `/regions/${id}/update/`,
  DELETE_AREA: (id) => `/regions/${id}/delete/`,
  ASSIGN_ADMIN: (id) => `/regions/${id}/assign-admin/`,
  ASSIGN_DOCTOR: (id) => `/regions/${id}/assign-doctor/`,
  // Popup endpoints
  CREATE_POPUP: '/popups/',
  GET_POPUPS: '/popups/',
  UPDATE_POPUP: (id) => `/popups/${id}/`,
  DELETE_POPUP: (id) => `/popups/${id}/delete/`,
  // Record endpoints
  CREATE_RECORD: '/records/',
  GET_RECORDS: '/records/',
  DELETE_RECORD: (id) => `/records/${id}/delete/`,
  UPDATE_RECORD: (id) => `/records/${id}/update/`,
  EXPORT_RECORDS_TO_PDF: '/records/export/pdf/',
  EXPORT_RECORDS_TO_EXCEL: '/records/export/excel/',
  ADD_FIELDS_TO_RECORDS: (id) => `/records/${id}/fields/`,
  //Güncelleme
  CREATE_FIELD: '/records/fields/',
  GET_FIELDS: '/records/fields/list/',
  UPDATE_FIELD: (id) => `/records/fields/${id}/update/`,
  DELETE_FIELD: (id) => `/records/fields/${id}/delete/`,
  GET_A_RECORD: (id) => `/records/${id}/`,
  ADD_VALUE_TO_RECORD: (id) => `/records/${id}/values/`,
  UPDATE_VALUE: (recordId, fieldId) => `/records/${recordId}/values/${fieldId}/update/`,
  DELETE_VALUE: (recordId, valueId) => `/records/${recordId}/values/${valueId}/delete/`,
};

// API istekleri için varsayılan ayarlar
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
};
