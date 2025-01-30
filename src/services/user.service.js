import { ENDPOINTS } from '../api/config';
import { apiService } from './api.service';

class UserService {
  async createNewUser(email, password, role) {
    try {
      const token = localStorage.getItem('token');
      
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };

      const data = {
        email: email,
        password: password,
        role: role
      };

      console.log('Gönderilen veri:', data);
      
      const response = await apiService.post(
        ENDPOINTS.CREATE_USER,
        data,
        headers
      );
      
      console.log('Sunucu yanıtı:', response);
      return response;
    } catch (error) {
      console.error('Kullanıcı oluşturma hatası:', error);
      throw error;
    }
  }

  async getUsers() {
    try {
      const token = localStorage.getItem('token');
      
      const headers = {
        'Authorization': `Bearer ${token}`
      };

      console.log('Kullanıcılar getiriliyor...');
      
      const response = await apiService.get(
        ENDPOINTS.GET_USERS,
        headers
      );
      
      console.log('Kullanıcı listesi:', response);
      return response;
    } catch (error) {
      console.error('Kullanıcı listesi getirme hatası:', error);
      throw error;
    }
  }
}

export const userService = new UserService();