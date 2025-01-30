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
}

export const areaService = new AreaService();