import { ENDPOINTS } from '../api/config';
import { apiService } from './api.service';

class PatientService {
  async getAllPatients() {
    return await apiService.get(ENDPOINTS.PATIENTS);
  }

  async getPatientById(id) {
    return await apiService.get(ENDPOINTS.PATIENT_DETAIL(id));
  }

  async createPatient(patientData) {
    return await apiService.post(ENDPOINTS.PATIENTS, patientData);
  }

  async updatePatient(id, patientData) {
    return await apiService.put(ENDPOINTS.PATIENT_DETAIL(id), patientData);
  }

  async deletePatient(id) {
    return await apiService.delete(ENDPOINTS.PATIENT_DETAIL(id));
  }
}

export const patientService = new PatientService();
