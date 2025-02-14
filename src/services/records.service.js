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

    async deleteRecord(id) {
        try {
            const token = localStorage.getItem('token');
            
            const headers = {
                'Authorization': `Bearer ${token}`
            };
            
            const response = await apiService.delete(
                ENDPOINTS.DELETE_RECORD(id),
                headers
            );
            
            return response;
        } catch (error) {
            console.error('Kayıt silme hatası:', error);
            throw error;
        }
    }

    async updateRecord(id, name, region) {
        try {
            const token = localStorage.getItem('token');
            
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            };
            
            const data = {
                name: name,
                //region: region
            };
            
            const response = await apiService.put(
                ENDPOINTS.UPDATE_RECORD(id),
                data,
                headers
            );
            
            return response;
        } catch (error) {
            console.error('Kayıt güncelleme hatası:', error);
            throw error;
        }
    }

    async exportRecordsToPDF() {
        try {
            const token = localStorage.getItem('token');
            
            const headers = {
                'Authorization': `Bearer ${token}`,
                'Accept': '*/*'  // Tüm content type'ları kabul et
            };
            
            // const response = await fetch('http://127.0.0.1:8000/records/export/pdf/', {
            const response = await fetch('http://92.205.61.102:8001/records/export/pdf/', {
                method: 'GET',
                headers: headers,
            });
            
            if (!response.ok) {
                throw new Error('PDF export failed');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'patients.pdf');
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            
            return true;
        } catch (error) {
            console.error('Kayıt PDF exporti hatası:', error);
            throw error;
        }
    }

    async exportRecordsToExcel() {
        try {
            const token = localStorage.getItem('token');
            
            const headers = {
                'Authorization': `Bearer ${token}`,
                'Accept': '*/*'  // Excel dosyası için gerekli header
            };
            
            // const response = await fetch('http://127.0.0.1:8000/records/export/excel/', {
            const response = await fetch('http://92.205.61.102:8001/records/export/excel/', {
                method: 'GET',
                headers: headers,
            });
            
            if (!response.ok) {
                throw new Error('Excel export failed');
            }
            
            // Response'u blob olarak al
            const blob = await response.blob();
            
            // Blob'u URL olarak oluştur
            const url = window.URL.createObjectURL(blob);
            
            // URL'yi kullanarak dosyayı indir
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'patients.xlsx');  // Dosya ismi
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            
            return true;
        } catch (error) {
            console.error('Kayıt Excel exporti hatası:', error);
            throw error;
        }
    }

    async addFieldsToRecord(recordId, fields) {
        try {
            const token = localStorage.getItem('token');
            
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            };
            
            const response = await apiService.post(
                ENDPOINTS.ADD_FIELDS_TO_RECORDS(recordId),
                fields,
                headers
            );
            
            return response;
        } catch (error) {
            console.error('Kayıt güncelleme hatası:', error);
            throw error;
        }
    }
    //Güncelleme
    async createField(fieldName, fieldType) {
        try {
            const token = localStorage.getItem('token');
            
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            };
            
            const data = {
                field_name: fieldName,
                field_type: fieldType
            };
            
            const response = await apiService.post(
                ENDPOINTS.CREATE_FIELD,
                data,
                headers
            );
            
            return response;
        } catch (error) {
            console.error('Kayıt oluşturma hatası:', error);
            throw error;
        }
    }

    async getFields() {
        try {
            const token = localStorage.getItem('token');
            
            const headers = {
                'Authorization': `Bearer ${token}`
            };
            
            const response = await apiService.get(
                ENDPOINTS.GET_FIELDS,
                headers
            );
            
            return response;
        } catch (error) {
            console.error('Kayıt listesi getirme hatası:', error);
            throw error;
        }
    }

    async updateField(id, fieldName, fieldType) {
        try {
            const token = localStorage.getItem('token');
            
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            };
            
            const data = {
                field_name: fieldName,
                field_type: fieldType
            };
            
            const response = await apiService.put(
                ENDPOINTS.UPDATE_FIELD(id),
                data,
                headers
            );
            
            return response;
        } catch (error) {
            console.error('Kayıt güncelleme hatası:', error);
            throw error;
        }
    }

    async deleteField(id) {
        try {
            const token = localStorage.getItem('token');
            
            const headers = {
                'Authorization': `Bearer ${token}`
            };
            
            const response = await apiService.delete(
                ENDPOINTS.DELETE_FIELD(id),
                headers
            );
            
            return response;
        } catch (error) {
            console.error('Kayıt silme hatası:', error);
            throw error;
        }
    }
}

export const recordsService = new RecordsService();