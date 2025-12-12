import apiClient from './api.client';

export const patientService = {
  async getPatients(page: number = 1, limit: number = 100, search?: string) {
    console.log('=== FETCHING PATIENTS ===');
    console.log('Search query:', search);
    
    try {
      const visitsResponse = await apiClient.get('/doctor/visits', { 
        params: { page: 1, limit: 1000 } 
      });
      
      console.log('Raw visits response:', visitsResponse.data);
      
      const visits = visitsResponse.data?.visits || visitsResponse.data?.data || visitsResponse.data || [];
      console.log('Extracted visits:', visits);
      console.log('Total visits:', visits.length);
      
      const uniquePatientsMap = new Map();
      
      visits.forEach((visit: any, index: number) => {
        console.log(`Visit ${index}:`, {
          visitId: visit.id,
          patient: visit.patient,
          hasPatient: !!visit.patient
        });
        
        if (visit.patient && visit.patient.id) {
          if (!uniquePatientsMap.has(visit.patient.id)) {
            uniquePatientsMap.set(visit.patient.id, {
              id: visit.patient.id,
              patientNumber: visit.patient.patientNumber,
              fullName: visit.patient.fullName,
              dateOfBirth: visit.patient.dateOfBirth,
              gender: visit.patient.gender,
              phone: visit.patient.phone,
              lastVisit: visit.visitDate
            });
          }
        }
      });
      
      let patients = Array.from(uniquePatientsMap.values());
      console.log('Unique patients before filter:', patients);
      
      if (search && search.trim()) {
        const searchLower = search.toLowerCase();
        patients = patients.filter((p: any) => 
          p.fullName?.toLowerCase().includes(searchLower) ||
          p.patientNumber?.toLowerCase().includes(searchLower)
        );
        console.log('Patients after search filter:', patients);
      }
      
      console.log('Final patients to return:', patients);
      
      return {
        data: patients,
        patients: patients
      };
      
    } catch (error: any) {
      console.error('Error fetching patients:', error);
      console.error('Error response:', error.response?.data);
      throw error;
    }
  },

  async getPatientById(id: string) {
    const response = await apiClient.get(`/doctor/patients/${id}`);
    return response.data;
  }
};