import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';

export interface Visit {
  id: string;
  tenantId: string;
  patientId: string;
  doctorId: string;
  appointmentId?: string;
  visitNumber: string;
  status: string;
  chiefComplaint?: string;
  clinicalNotes?: string;
  diagnosisCodes?: Array<{ code: string; description: string }>;
  vitals?: Record<string, unknown>;
  signedAt?: string;
  signedBy?: string;
  createdAt: string;
  updatedAt: string;
  patient?: {
    id: string;
    patientNumber: string;
    firstName: string;
    lastName: string;
  };
  doctor?: {
    id: string;
    firstName: string;
    lastName: string;
    licenseNumber?: string;
    specialization?: string;
  };
  appointment?: {
    id: string;
    procedureType?: string;
  };
  procedureNotes?: ProcedureNote[];
  photos?: Photo[];
  prescriptions?: Prescription[];
}

export interface ProcedureNote {
  id: string;
  tenantId: string;
  visitId: string;
  templateId?: string;
  procedureName: string;
  bodyArea?: string;
  settings?: Record<string, unknown>;
  notes?: string;
  complications?: string;
  performedBy: string;
  createdAt: string;
  updatedAt: string;
  template?: ProcedureTemplate;
  performer?: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

export interface ProcedureTemplate {
  id: string;
  tenantId?: string;
  name: string;
  category: string;
  fieldsSchema: Record<string, unknown>;
  defaultValues?: Record<string, unknown>;
  instructions?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Photo {
  id: string;
  storageKey: string;
  thumbnailKey?: string;
  bodyRegion: string;
  bodySubRegion?: string;
  captureDate: string;
  signedUrl?: string;
  thumbnailSignedUrl?: string;
}

export interface Prescription {
  id: string;
  notes?: string;
  createdAt: string;
  items: PrescriptionItem[];
}

export interface PrescriptionItem {
  id: string;
  drugName: string;
  dosage?: string;
  frequency?: string;
  duration?: string;
  route?: string;
  instructions?: string;
}

export interface VisitListResponse {
  data: Visit[];
  meta: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
  };
}

export interface VisitQueryParams {
  page?: number;
  perPage?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  patientId?: string;
  doctorId?: string;
  status?: string;
  from?: string;
  to?: string;
}

export function useVisits(query?: VisitQueryParams) {
  return useQuery({
    queryKey: ['visits', query],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (query?.page) params.set('page', String(query.page));
      if (query?.perPage) params.set('perPage', String(query.perPage));
      if (query?.sortBy) params.set('sortBy', query.sortBy);
      if (query?.sortOrder) params.set('sortOrder', query.sortOrder);
      if (query?.patientId) params.set('patientId', query.patientId);
      if (query?.doctorId) params.set('doctorId', query.doctorId);
      if (query?.status) params.set('status', query.status);
      if (query?.from) params.set('from', query.from);
      if (query?.to) params.set('to', query.to);

      const response = await api.get<VisitListResponse>(`/visits?${params.toString()}`);
      return response.data;
    },
  });
}

export function useVisit(id: string) {
  return useQuery({
    queryKey: ['visits', id],
    queryFn: async () => {
      const response = await api.get<Visit>(`/visits/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useCreateVisit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      patientId: string;
      doctorId: string;
      appointmentId?: string;
      chiefComplaint?: string;
    }) => {
      const response = await api.post('/visits', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['visits'] });
    },
  });
}

export function useUpdateVisit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CreateVisitDto> }) => {
      const response = await api.patch(`/visits/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['visits'] });
    },
  });
}

export function useSignVisit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.post(`/visits/${id}/sign`, {});
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['visits'] });
    },
  });
}

export function useAddAddendum() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, content, reason }: { id: string; content: string; reason?: string }) => {
      const response = await api.post(`/visits/${id}/addendum`, { content, reason });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['visits'] });
    },
  });
}

export function useProcedureNotes(visitId: string) {
  return useQuery({
    queryKey: ['visits', visitId, 'procedure-notes'],
    queryFn: async () => {
      const response = await api.get<ProcedureNote[]>(`/visits/${visitId}/procedure-notes`);
      return response.data;
    },
    enabled: !!visitId,
  });
}

export function useCreateProcedureNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ visitId, data }: { visitId: string; data: CreateProcedureNoteDto }) => {
      const response = await api.post(`/visits/${visitId}/procedure-notes`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['visits'] });
    },
  });
}

export function useProcedureTemplates() {
  return useQuery({
    queryKey: ['visits', 'templates'],
    queryFn: async () => {
      const response = await api.get<{ data: ProcedureTemplate[] }>('/visits/templates');
      return response.data;
    },
  });
}

export function useSearchIcd10(query: string) {
  return useQuery({
    queryKey: ['visits', 'icd10', 'search', query],
    queryFn: async () => {
      const response = await api.post<{ code: string; description: string; category?: string }[]>('/visits/icd10/search', { query });
      return response.data;
    },
    enabled: query.length >= 2,
  });
}

export function useMostUsedIcd10() {
  return useQuery({
    queryKey: ['visits', 'icd10', 'most-used'],
    queryFn: async () => {
      const response = await api.get<{ code: string; description: string; count: number }[]>('/visits/icd10/most-used');
      return response.data;
    },
  });
}

export interface CreateVisitDto {
  patientId: string;
  doctorId: string;
  appointmentId?: string;
  chiefComplaint?: string;
}

export interface CreateProcedureNoteDto {
  templateId?: string;
  procedureName: string;
  bodyArea?: string;
  settings?: Record<string, unknown>;
  notes?: string;
  complications?: string;
}