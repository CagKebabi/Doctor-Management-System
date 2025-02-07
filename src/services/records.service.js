import {apiService} from "./api.service";
import { ENDPOINTS } from "@/api/config";

class RecordsService {
    async getRecords() {
        try {
            const token = localStorage.getItem('token');
            
            const headers = {
                'Authorization': `Bearer ${token}`
            };
            
            const response = await apiService.get(
                ENDPOINTS.GET_RECORDS,
                headers
            );
            
            return response;
        } catch (error) {
            console.error('Kayıt listesi getirme hatası:', error);
            throw error;
        }
    }
    
    async createNewRecord(name, region) {
        try {
            const token = localStorage.getItem('token');
            
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            };
            
            const data = {
                name: name,
                region: region
            };
            
            const response = await apiService.post(
                ENDPOINTS.CREATE_RECORD,
                data,
                headers
            );
            
            return response;
        } catch (error) {
            console.error('Kayıt oluşturma hatası:', error);
            throw error;
        }
    }
}

export const recordsService = new RecordsService();