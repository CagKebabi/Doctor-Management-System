import { API_BASE_URL, DEFAULT_HEADERS } from '../api/config';

class ApiService {
  getHeaders() {
    const headers = { ...DEFAULT_HEADERS };
    const token = localStorage.getItem('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  async get(endpoint, headers = null) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: headers || this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`API isteği başarısız: ${response.status}`);
    }

    return response.json();
  }

  async post(endpoint, data, headers = null) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: headers || this.getHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`API isteği başarısız: ${response.status}`);
    }

    return response.json();
  }
}

export const apiService = new ApiService();