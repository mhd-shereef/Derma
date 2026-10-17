import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';

export interface Photo {
  id: string;
  tenantId: string;
  patientId: string;
  visitId?: string;
  storageKey: string;
  thumbnailKey?: string;
  originalFilename: string;
  mimeType: string;
  fileSizeBytes: number | string;
  bodyRegion: string;
  bodySubRegion?: string;
  annotations?: Annotation[];
  captureDate: string;
  uploadedBy: string;
  marketingConsent: boolean;
  createdAt: string;
  deletedAt?: string;
  visit?: {
    id: string;
    visitNumber: string;
    createdAt: string;
  };
  signedUrl?: string;
  thumbnailSignedUrl?: string;
  signedUrlExpiresIn?: number;
}

export interface Annotation {
  type: 'circle' | 'arrow' | 'text' | 'rectangle';
  coordinates: { x: number; y: number; width?: number; height?: number; radius?: number; x2?: number; y2?: number };
  text?: string;
  color?: string;
  strokeWidth?: number;
}

export interface PhotoListResponse {
  data: Photo[];
  meta: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
  };
}

export interface UploadUrlResponse {
  uploadUrl: string;
  objectKey: string;
  expiresIn: number;
}

export interface PhotoComparisonPhoto {
  id: string;
  storageKey: string;
  thumbnailKey?: string;
  bodyRegion: string;
  bodySubRegion?: string;
  captureDate: string;
  annotations?: Annotation[];
  signedUrl: string;
  thumbnailSignedUrl?: string;
}

export interface PhotoQueryParams {
  page?: number;
  perPage?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  patientId?: string;
  visitId?: string;
  bodyRegion?: string;
  bodySubRegion?: string;
  from?: string;
  to?: string;
}

export function usePhotos(query?: PhotoQueryParams) {
  return useQuery({
    queryKey: ['photos', query],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (query?.page) params.set('page', String(query.page));
      if (query?.perPage) params.set('perPage', String(query.perPage));
      if (query?.sortBy) params.set('sortBy', query.sortBy);
      if (query?.sortOrder) params.set('sortOrder', query.sortOrder);
      if (query?.search) params.set('search', query.search);
      if (query?.patientId) params.set('patientId', query.patientId);
      if (query?.visitId) params.set('visitId', query.visitId);
      if (query?.bodyRegion) params.set('bodyRegion', query.bodyRegion);
      if (query?.bodySubRegion) params.set('bodySubRegion', query.bodySubRegion);
      if (query?.from) params.set('from', query.from);
      if (query?.to) params.set('to', query.to);

      const response = await api.get<PhotoListResponse>(`/photos?${params.toString()}`);
      return response.data;
    },
  });
}

export function usePatientPhotos(patientId: string) {
  return useQuery({
    queryKey: ['photos', 'patient', patientId],
    queryFn: async () => {
      const response = await api.get<Photo[]>(`/photos/patient/${patientId}`);
      return response.data;
    },
    enabled: !!patientId,
  });
}

export function usePhoto(id: string) {
  return useQuery({
    queryKey: ['photos', id],
    queryFn: async () => {
      const response = await api.get<Photo>(`/photos/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useGetUploadUrl() {
  return useMutation({
    mutationFn: async (data: {
      visitId: string;
      filename: string;
      contentType: string;
      bodyRegion: string;
      bodySubRegion?: string;
    }) => {
      const response = await api.post<UploadUrlResponse>('/photos/upload-url', data);
      return response.data;
    },
  });
}

export function useRegisterPhoto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      visitId: string;
      storageKey: string;
      thumbnailKey?: string;
      originalFilename: string;
      mimeType: string;
      fileSizeBytes: number;
      bodyRegion: string;
      bodySubRegion?: string;
      marketingConsent?: boolean;
    }) => {
      const response = await api.post('/photos', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['photos'] });
    },
  });
}

export function useUpdatePhoto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdatePhotoDto }) => {
      const response = await api.patch(`/photos/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['photos'] });
    },
  });
}

export function useAddAnnotation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, annotation }: { id: string; annotation: Annotation }) => {
      const response = await api.post(`/photos/${id}/annotations`, annotation);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['photos'] });
    },
  });
}

export function usePhotoComparison(patientId: string, bodyRegion: string, bodySubRegion?: string) {
  return useQuery({
    queryKey: ['photos', 'compare', patientId, bodyRegion, bodySubRegion],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.set('bodyRegion', bodyRegion);
      if (bodySubRegion) params.set('bodySubRegion', bodySubRegion);
      const response = await api.get<PhotoComparisonPhoto[]>(`/photos/patient/${patientId}/compare?${params.toString()}`);
      return response.data;
    },
    enabled: !!patientId && !!bodyRegion,
  });
}

export function usePhotoAccessLog(photoId: string) {
  return useQuery({
    queryKey: ['photos', photoId, 'access-log'],
    queryFn: async () => {
      const response = await api.get<{ photoId: string; userId: string; accessType: string; createdAt: string }[]>(`/photos/${photoId}/access-log`);
      return response.data;
    },
    enabled: !!photoId,
  });
}

export function useDeletePhoto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/photos/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['photos'] });
    },
  });
}

export interface UpdatePhotoDto {
  bodyRegion?: string;
  bodySubRegion?: string;
  annotations?: Annotation[];
  marketingConsent?: boolean;
}