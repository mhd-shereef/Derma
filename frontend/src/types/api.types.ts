export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  tenantId: string;
  licenseNumber?: string;
  specialization?: string;
}

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  gstin?: string;
  address?: {
    line1?: string;
    city?: string;
    state?: string;
    pincode?: string;
    country?: string;
  };
  phone?: string;
  email?: string;
  logoUrl?: string;
  settings: Record<string, unknown>;
  subscriptionStatus: string;
}

export interface Patient {
  id: string;
  tenantId: string;
  patientNumber: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  gender?: string;
  phone: string;
  email?: string;
  address?: Record<string, unknown>;
  emergencyContact?: Record<string, unknown>;
  bloodGroup?: string;
  allergies: string[];
  medicalHistory?: Record<string, unknown>;
  notes?: string;
  profilePhotoKey?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

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
  patient?: Patient;
  doctor?: User;
}

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
  patient?: Patient;
  doctor?: User;
  appointment?: Appointment;
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
}

export interface Photo {
  id: string;
  tenantId: string;
  patientId: string;
  visitId?: string;
  storageKey: string;
  thumbnailKey?: string;
  originalFilename: string;
  mimeType: string;
  fileSizeBytes: number;
  bodyRegion: string;
  bodySubRegion?: string;
  annotations?: Array<{ type: string; coordinates: unknown; text?: string }>;
  captureDate: string;
  uploadedBy: string;
  marketingConsent: boolean;
  createdAt: string;
  signedUrl?: string;
  thumbnailSignedUrl?: string;
}

export interface Prescription {
  id: string;
  tenantId: string;
  visitId: string;
  patientId: string;
  doctorId: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  items: PrescriptionItem[];
  patient?: Patient;
  doctor?: User;
}

export interface PrescriptionItem {
  id: string;
  prescriptionId: string;
  drugName: string;
  dosage?: string;
  frequency?: string;
  duration?: string;
  route?: string;
  instructions?: string;
  sortOrder: number;
  createdAt: string;
}

export interface Regimen {
  id: string;
  tenantId: string;
  name: string;
  description?: string;
  items: Array<{
    drugName: string;
    dosage?: string;
    frequency?: string;
    duration?: string;
    route?: string;
    instructions?: string;
  }>;
  createdBy: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProcedureCatalog {
  id: string;
  tenantId: string;
  name: string;
  category: string;
  description?: string;
  defaultPrice: number;
  durationMinutes?: number;
  hsnSacCode?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Package {
  id: string;
  tenantId: string;
  name: string;
  procedureId: string;
  totalSessions: number;
  price: number;
  validityDays: number;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  procedure?: ProcedureCatalog;
}

export interface PatientPackage {
  id: string;
  tenantId: string;
  patientId: string;
  packageId: string;
  sessionsTotal: number;
  sessionsUsed: number;
  purchaseDate: string;
  expiryDate: string;
  status: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  package?: Package;
  sessions?: PackageSession[];
}

export interface PackageSession {
  id: string;
  patientPackageId: string;
  visitId: string;
  sessionNumber: number;
  performedAt: string;
  notes?: string;
}

export interface Invoice {
  id: string;
  tenantId: string;
  patientId: string;
  visitId?: string;
  invoiceNumber: string;
  invoiceDate: string;
  subtotal: number;
  discountAmount: number;
  discountReason?: string;
  taxAmount: number;
  totalAmount: number;
  amountPaid: number;
  amountDue: number;
  status: string;
  notes?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  items: InvoiceItem[];
  patient?: Patient;
  payments?: Payment[];
}

export interface InvoiceItem {
  id: string;
  invoiceId: string;
  description: string;
  procedureId?: string;
  patientPackageId?: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  taxRate: number;
  cgst: number;
  sgst: number;
  igst: number;
  total: number;
  sortOrder: number;
}

export interface Payment {
  id: string;
  tenantId: string;
  invoiceId: string;
  amount: number;
  paymentMode: string;
  referenceNumber?: string;
  paymentDate: string;
  receivedBy: string;
  notes?: string;
  createdAt: string;
}

export interface AuditLog {
  id: number;
  tenantId: string;
  userId?: string;
  action: string;
  entityType: string;
  entityId?: string;
  oldValue?: Record<string, unknown>;
  newValue?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  user?: User;
}

export interface PaginationMeta {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: true;
  data: T;
  meta?: PaginationMeta;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown[];
    timestamp: string;
    requestId: string;
  };
}

export type ApiResult<T> = ApiResponse<T> | ApiErrorResponse;