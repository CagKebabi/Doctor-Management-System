import { ENDPOINTS } from '../api/config';
import { apiService } from './api.service';

class AuthService {
  async login(email, password) {
    try {
      const response = await apiService.post(ENDPOINTS.LOGIN, {
        email,
        password
      });
      
      if (response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('refreshToken', response.refresh);
      }
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  isAuthenticated() {
    return !!localStorage.getItem('token');
  }

  async logout() {
    try {
      const token = localStorage.getItem('token');
      const refresh = localStorage.getItem('refreshToken');
      
      console.log('Token:', token);
      console.log('Refresh Token:', refresh);
      
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };

      const response = await apiService.post(
        ENDPOINTS.LOGOUT, 
        { refresh: refresh },
        headers
      );
      
      console.log('Logout Response:', response);
      
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userEmail');
      
      return response;
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }
}

export const authService = new AuthService();
