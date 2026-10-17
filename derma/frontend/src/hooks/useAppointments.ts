import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';

export interface Appointment {
  id: string;
  tenantId: string;
  patientId: string;
  doctorId: string;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  procedureType?: string;
  status: string;
  checkInTime?: string;
  cancellationReason?: string;
  notes?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  patient?: {
    id: string;
    patientNumber: string;
    firstName: string;
    lastName: string;
    phone: string;
  };
  doctor?: {
    id: string;
    firstName: string;
    lastName: string;
    specialization?: string;
  };
}

export interface AppointmentListResponse {
  data: Appointment[];
  meta: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
  };
}

export interface AvailableSlot {
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export interface AppointmentQueryParams {
  page?: number;
  perPage?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  patientId?: string;
  doctorId?: string;
  from?: string;
  to?: string;
  status?: string;
}

export function useAppointments(query?: AppointmentQueryParams) {
  return useQuery({
    queryKey: ['appointments', query],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (query?.page) params.set('page', String(query.page));
      if (query?.perPage) params.set('perPage', String(query.perPage));
      if (query?.sortBy) params.set('sortBy', query.sortBy);
      if (query?.sortOrder) params.set('sortOrder', query.sortOrder);
      if (query?.search) params.set('search', query.search);
      if (query?.patientId) params.set('patientId', query.patientId);
      if (query?.doctorId) params.set('doctorId', query.doctorId);
      if (query?.from) params.set('from', query.from);
      if (query?.to) params.set('to', query.to);
      if (query?.status) params.set('status', query.status);

      const response = await api.get<AppointmentListResponse>(`/appointments?${params.toString()}`);
      return response.data;
    },
  });
}

export function useQueue(doctorId?: string, date?: string) {
  return useQuery({
    queryKey: ['appointments', 'queue', doctorId, date],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (doctorId) params.set('doctorId', doctorId);
      if (date) params.set('date', date);

      const response = await api.get<Appointment[]>(`/appointments/queue?${params.toString()}`);
      return response.data;
    },
    refetchInterval: 30000,
  });
}

export function useCalendar(doctorId: string, from: string, to: string) {
  return useQuery({
    queryKey: ['appointments', 'calendar', doctorId, from, to],
    queryFn: async () => {
      const response = await api.get<Appointment[]>(`/appointments/calendar?doctorId=${doctorId}&from=${from}&to=${to}`);
      return response.data;
    },
    enabled: !!doctorId && !!from && !!to,
  });
}

export function useAvailableSlots(doctorId: string, date: string) {
  return useQuery({
    queryKey: ['appointments', 'slots', doctorId, date],
    queryFn: async () => {
      const response = await api.get<AvailableSlot[]>(`/appointments/slots?doctorId=${doctorId}&date=${date}`);
      return response.data;
    },
    enabled: !!doctorId && !!date,
  });
}

export function useCreateAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      patientId: string;
      doctorId: string;
      appointmentDate: string;
      startTime: string;
      endTime: string;
      procedureType?: string;
      notes?: string;
    }) => {
      const response = await api.post('/appointments', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });
}

export function useUpdateAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CreateAppointmentDto> }) => {
      const response = await api.patch(`/appointments/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });
}

export function useCheckIn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.post(`/appointments/${id}/check-in`, {});
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['appointments', 'queue'] });
    },
  });
}

export function useCancelAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason: string }) => {
      const response = await api.post(`/appointments/${id}/cancel`, { reason });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });
}

export function useReorderQueue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (appointmentIds: string[]) => {
      const response = await api.post('/appointments/queue/reorder', { appointmentIds });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments', 'queue'] });
    },
  });
}

interface CreateAppointmentDto {
  patientId: string;
  doctorId: string;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  procedureType?: string;
  notes?: string;
}