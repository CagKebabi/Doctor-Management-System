import { ENDPOINTS } from "@/api/config";
import { apiService } from "./api.service";

export class AreaService {
    async createNewArea(name, description) {
        try {
            const token = localStorage.getItem('token');
            
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            };

            const data = {
                name: name,
                description: description
            };
            
            const response = await apiService.post(
                ENDPOINTS.CREATE_AREA,
                data,
                headers
            );
            
            return response;
        } catch (error) {
            console.error('Bölge oluşturma hatası:', error);
            throw error;
        }
    }
    async getAreas() {
        try {
            const token = localStorage.getItem('token');
            
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            };

            console.log('Bölge listesi getiriliyor...');
            
            const response = await apiService.get(
                ENDPOINTS.GET_AREAS,
                headers
            );
            
            console.log('Bölge listesi:', response);
            return response;
        } catch (error) {
            console.error('Bölge listesi getirme hatası:', error);
            throw error;
        }
    }
    async updateArea(formData, areaId) {
        try {
            const token = localStorage.getItem('token');
            
            const headers = {
                'Authorization': `Bearer ${token}`
                // Content-Type header'ı FormData ile otomatik ayarlanacak
            };
            
            const response = await apiService.put(
                ENDPOINTS.UPDATE_AREA(areaId),
                formData,
                headers
            );
            
            return response;
        } catch (error) {
            console.error('Bölge editleme hatası:', error);
            throw error;
        }
    }
    async deleteArea(areaId) {
        try {
            const token = localStorage.getItem('token');
            
            const headers = {
                'Authorization': `Bearer ${token}`
            };
            
            const response = await apiService.delete(
                ENDPOINTS.DELETE_AREA(areaId),
                headers
            );
            
            return response;
        } catch (error) {
            console.error('Bölge silme hatası:', error);
            throw error;
        }
    }
    async assignAdmin(areaId, formData) {
        try {
            const token = localStorage.getItem('token');
            
            const headers = {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            };
            
            const response = await apiService.post(
                ENDPOINTS.ASSIGN_ADMIN(areaId),
                formData,
                headers
            );
            
            return response;
        } catch (error) {
            console.error('Bölgeye admin ekleme hatası:', error);
            throw error;
        }
    }
    async assignDoctor(areaId, formData) {
        try {
            const token = localStorage.getItem('token');
            
            const headers = {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            };
            
            const response = await apiService.post(
                ENDPOINTS.ASSIGN_DOCTOR(areaId),
                formData,
                headers
            );
            
            return response;
        } catch (error) {
            console.error('Bölgeye doktor ekleme hatası:', error);
            throw error;
        }
    }
    async removeAdmin(areaId, userId) {
        try {
            const token = localStorage.getItem('token');
            
            const headers = {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            };
            
            const response = await apiService.post(
                ENDPOINTS.REMOVE_ADMIN(areaId),
                {
                    user_id: userId
                },
                headers
            );
            
            return response;
        } catch (error) {
            console.error('Bölgeye admin kaldırma hatası:', error);
            throw error;
        }
    }
    async removeDoctor(areaId, userId) {
        try {
            const token = localStorage.getItem('token');
            
            const headers = {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            };
            
            const response = await apiService.post  (
                ENDPOINTS.REMOVE_DOCTOR(areaId),
                {
                    user_id: userId
                },
                headers
            );
            
            return response;
        } catch (error) {
            console.error('Bölgeye doktor kaldırma hatası:', error);
            throw error;
        }
    }
}

export const areaService = new AreaService();