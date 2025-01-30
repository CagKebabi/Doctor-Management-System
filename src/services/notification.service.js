import { ENDPOINTS } from "@/api/config";
import { apiService } from "./api.service";

export class NotificationService {
    async createNewNotification(content, role, region) {
        try {
            const token = localStorage.getItem('token');
            
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            };

            const data = {
                content: content,
                role: role,
                region: region
            };
            
            const response = await apiService.post(
                ENDPOINTS.CREATE_NOTIFICATION,
                data,
                headers
            );
            
            return response;
        } catch (error) {
            console.error('Notifikasyon oluşturma hatası:', error);
            throw error;
        }
    }
    async getNotifications() {
        try {
            const token = localStorage.getItem('token');
            
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            };

            console.log('Notifikasyonlar getiriliyor...');
            
            const response = await apiService.get(
                ENDPOINTS.GET_NOTIFICATIONS,
                headers
            );
            
            console.log('Notifikasyon listesi:', response);
            return response;
        } catch (error) {
            console.error('Notifikasyon listesi getirme hatası:', error);
            throw error;
        }
    }
}

export const notificationService = new NotificationService();