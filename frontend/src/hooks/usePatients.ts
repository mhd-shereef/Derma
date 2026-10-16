import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';

export interface PatientQueryDto {
  page?: number;
  perPage?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  gender?: string;
  phone?: string;
  email?: string;
  dobYear?: number;
}

export interface Patient {
  id: string;
  patientNumber: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  gender?: string;
  phone: string;
  email?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PatientListResponse {
  data: Patient[];
  meta: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
  };
}

export interface DuplicateCheckResult {
  id: string;
  patientNumber: string;
  firstName: string;
  lastName: string;
  phone: string;
  dateOfBirth?: string;
  similarityScore: number;
}

export function usePatients(query?: PatientQueryDto) {
  return useQuery({
    queryKey: ['patients', query],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (query?.page) params.set('page', String(query.page));
      if (query?.perPage) params.set('perPage', String(query.perPage));
      if (query?.sortBy) params.set('sortBy', query.sortBy);
      if (query?.sortOrder) params.set('sortOrder', query.sortOrder);
      if (query?.search) params.set('search', query.search);
      if (query?.gender) params.set('gender', query.gender);
      if (query?.phone) params.set('phone', query.phone);
      if (query?.email) params.set('email', query.email);
      if (query?.dobYear) params.set('dobYear', String(query.dobYear));

      const response = await api.get<PatientListResponse>(`/patients?${params.toString()}`);
      return response.data;
    },
  });
}

export function usePatientSearch(search: string, limit = 10) {
  return useQuery({
    queryKey: ['patients', 'search', search],
    queryFn: async () => {
      if (search.length < 2) return [];
      const response = await api.get<Patient[]>(`/patients/search?q=${encodeURIComponent(search)}&limit=${limit}`);
      return response.data;
    },
    enabled: search.length >= 2,
  });
}

export function useCreatePatient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { firstName: string; lastName: string; phone: string; email?: string; dateOfBirth?: string; gender?: string }) => {
      const response = await api.post('/patients', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
    },
  });
}

export function useCheckDuplicate() {
  return useMutation({
    mutationFn: async (data: { firstName: string; lastName: string; phone: string; dateOfBirth?: string }) => {
      const response = await api.post<DuplicateCheckResult[]>('/patients/check-duplicate', data);
      return response.data;
    },
  });
}