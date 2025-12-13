// src/services/visit.service.ts
import apiClient from "./api.client";

export type GenderType = "L" | "P";
export type VisitStatusType = "WAITING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";

export interface PatientPayload {
  id?: string;          
  fullName: string;
  dateOfBirth: string;   
  gender: GenderType;
  phone: string;
  email?: string;
  address?: string;
  bloodType?: string;
  allergies?: string;
  medicalHistory?: string;
}

export interface VisitPayload {
  visitDate: string;          // ISO string
  chiefComplaint?: string;
  bloodPressure?: string;
  notes?: string;
}

export interface CreateVisitData {
  patient: PatientPayload;
  visit: VisitPayload;
}

export interface VisitPatient {
  id: string;
  patientNumber: string;
  fullName: string;
  phone: string;
  gender: string;       // "L" | "P"
  dateOfBirth: string;
  email?: string;
  address?: string;
  bloodType?: string;
  allergies?: string;
  medicalHistory?: string;
}

export interface VisitNurse {
  id: string;
  fullName: string;
}

export interface Treatment {
  id: string;
  diagnosis?: string;
  treatmentNotes?: string;
  quantity: number;
  subtotal: number;
  toothNumber?: string | null;
  createdAt: string;
  service?: {
    serviceName: string;
  };
  performer?: {
    id: string;
    fullName: string;
  };
}

export interface Visit {
  id: string;
  visitNumber: string;
  visitDate: string;
  queueNumber: number;
  status: VisitStatusType;
  chiefComplaint?: string;
  bloodPressure?: string;
  notes?: string;
  totalCost?: number;

  patient: VisitPatient;

  doctor?: {
    id: string;
    fullName: string;
  } | null;

  nurse?: VisitNurse | null;
  treatments?: Treatment[];
}

export interface VisitListResponse {
  visits: Visit[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const visitService = {
  async getDoctorQueue(search?: string): Promise<Visit[]> {
    const params = search ? { search } : {};
    const res = await apiClient.get<Visit[]>("/doctor/visits/queue", { params });
    return res.data;
  },

  async getNurseQueue(search?: string): Promise<Visit[]> {
    const params = search ? { search } : {};
    const res = await apiClient.get<Visit[]>("/doctor/visits/queue", { params });
    return res.data;
  },

  async getCompletedVisits(
    page: number = 1,
    limit: number = 10,
    search?: string
  ): Promise<VisitListResponse> {
    const params: any = { page, limit };
    if (search) params.search = search;

    const res = await apiClient.get<VisitListResponse>("/doctor/visits/completed", {
      params,
    });
    return res.data;
  },

  async getVisitById(id: string): Promise<Visit> {
    const res = await apiClient.get<Visit>(`/doctor/visits/${id}`);
    return res.data;
  },

  async createVisitAsDoctor(data: CreateVisitData): Promise<Visit> {
    const res = await apiClient.post<Visit>("/doctor/visits", data);
    return res.data;
  },

  async createVisitAsNurse(data: CreateVisitData): Promise<Visit> {
    const res = await apiClient.post<Visit>("/doctor/visits", data);
    return res.data;
  },

  async updateVisitStatus(id: string, status: VisitStatusType): Promise<Visit> {
    const res = await apiClient.patch<Visit>(`/doctor/visits/${id}/status`, {
      status,
    });
    return res.data;
  },
};
