import { ENDPOINTS } from "@/api/config";
import { apiService } from "./api.service";

export class PopupService {
    async createNewPopup(formData) {
        try {
            const token = localStorage.getItem('token');
            
            const headers = {
                'Authorization': `Bearer ${token}`
                // Content-Type header'ı FormData ile otomatik ayarlanacak
            };
            
            const response = await apiService.post(
                ENDPOINTS.CREATE_POPUP,
                formData,
                headers
            );
            
            return response;
        } catch (error) {
            console.error('Popup oluşturma hatası:', error);
            throw error;
        }
    }

    async getPopups() {
        try {
            const token = localStorage.getItem('token');
            
            const headers = {
                'Authorization': `Bearer ${token}`
            };

            console.log('Popup listesi getiriliyor...');
            
            const response = await apiService.get(
                ENDPOINTS.GET_POPUPS,
                headers
            );
            
            console.log('Popup listesi:', response);
            return response;
        } catch (error) {
            console.error('Popup listesi getirme hatası:', error);
            throw error;
        }
    }

    async updatePopup(id, formData) {
        try {
            const token = localStorage.getItem('token');
            
            const headers = {
                'Authorization': `Bearer ${token}`
                // Content-Type header'ı FormData ile otomatik ayarlanacak
            };
            
            const response = await apiService.patch(
                ENDPOINTS.UPDATE_POPUP(id),
                formData,
                headers
            );
            
            return response;
        } catch (error) {
            console.error('Popup güncelleme hatası:', error);
            throw error;
        }
    }

    async deletePopup(id) {
        try {
            const token = localStorage.getItem('token');
            
            const headers = {
                'Authorization': `Bearer ${token}`
            };
            
            const response = await apiService.delete(
                ENDPOINTS.DELETE_POPUP(id),
                headers
            );
            
            return response;
        } catch (error) {
            console.error('Popup silme hatası:', error);
            throw error;
        }
    }
}

export const popupService = new PopupService();