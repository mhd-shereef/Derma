export const USER_ROLES = {
  OWNER: 'OWNER',
  ADMIN: 'ADMIN',
  DOCTOR: 'DOCTOR',
  NURSE: 'NURSE',
  RECEPTIONIST: 'RECEPTIONIST',
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export const ROLE_LABELS: Record<UserRole, string> = {
  OWNER: 'Owner',
  ADMIN: 'Admin',
  DOCTOR: 'Doctor',
  NURSE: 'Nurse',
  RECEPTIONIST: 'Receptionist',
};

export const ROLE_HIERARCHY: Record<UserRole, number> = {
  OWNER: 5,
  ADMIN: 4,
  DOCTOR: 3,
  NURSE: 2,
  RECEPTIONIST: 1,
};

export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  OWNER: ['*'],
  ADMIN: [
    'manage_staff',
    'view_audit_logs',
    'manage_templates',
    'manage_packages',
    'manage_catalog',
    'view_reports',
    'export_data',
    'register_patients',
    'manage_appointments',
    'create_invoices',
    'record_payments',
    'print_prescriptions',
    'view_photos',
  ],
  DOCTOR: [
    'create_visits',
    'sign_visits',
    'upload_photos',
    'view_photos',
    'create_prescriptions',
    'print_prescriptions',
    'manage_appointments',
    'view_patients',
  ],
  NURSE: [
    'upload_photos',
    'view_photos',
    'view_patients',
    'print_prescriptions',
  ],
  RECEPTIONIST: [
    'register_patients',
    'manage_appointments',
    'create_invoices',
    'record_payments',
    'print_prescriptions',
    'view_patients',
  ],
};

export const APPOINTMENT_STATUS = {
  BOOKED: 'BOOKED',
  CONFIRMED: 'CONFIRMED',
  CHECKED_IN: 'CHECKED_IN',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  NO_SHOW: 'NO_SHOW',
} as const;

export type AppointmentStatus = (typeof APPOINTMENT_STATUS)[keyof typeof APPOINTMENT_STATUS];

export const APPOINTMENT_STATUS_LABELS: Record<AppointmentStatus, string> = {
  BOOKED: 'Booked',
  CONFIRMED: 'Confirmed',
  CHECKED_IN: 'Checked In',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
  NO_SHOW: 'No Show',
};

export const APPOINTMENT_STATUS_COLORS: Record<AppointmentStatus, string> = {
  BOOKED: 'bg-blue-100 text-blue-800',
  CONFIRMED: 'bg-green-100 text-green-800',
  CHECKED_IN: 'bg-yellow-100 text-yellow-800',
  IN_PROGRESS: 'bg-purple-100 text-purple-800',
  COMPLETED: 'bg-gray-100 text-gray-800',
  CANCELLED: 'bg-red-100 text-red-800',
  NO_SHOW: 'bg-orange-100 text-orange-800',
};

export const VISIT_STATUS = {
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  SIGNED: 'SIGNED',
  AMENDED: 'AMENDED',
} as const;

export type VisitStatus = (typeof VISIT_STATUS)[keyof typeof VISIT_STATUS];

export const VISIT_STATUS_LABELS: Record<VisitStatus, string> = {
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
  SIGNED: 'Signed',
  AMENDED: 'Amended',
};

export const INVOICE_STATUS = {
  DRAFT: 'DRAFT',
  ISSUED: 'ISSUED',
  PARTIALLY_PAID: 'PARTIALLY_PAID',
  PAID: 'PAID',
  CANCELLED: 'CANCELLED',
  REFUNDED: 'REFUNDED',
} as const;

export type InvoiceStatus = (typeof INVOICE_STATUS)[keyof typeof INVOICE_STATUS];

export const INVOICE_STATUS_LABELS: Record<InvoiceStatus, string> = {
  DRAFT: 'Draft',
  ISSUED: 'Issued',
  PARTIALLY_PAID: 'Partially Paid',
  PAID: 'Paid',
  CANCELLED: 'Cancelled',
  REFUNDED: 'Refunded',
};

export const PAYMENT_MODES = {
  CASH: 'CASH',
  CARD: 'CARD',
  UPI: 'UPI',
  BANK_TRANSFER: 'BANK_TRANSFER',
  OTHER: 'OTHER',
} as const;

export type PaymentMode = (typeof PAYMENT_MODES)[keyof typeof PAYMENT_MODES];

export const PAYMENT_MODE_LABELS: Record<PaymentMode, string> = {
  CASH: 'Cash',
  CARD: 'Card',
  UPI: 'UPI',
  BANK_TRANSFER: 'Bank Transfer',
  OTHER: 'Other',
};

export const PATIENT_GENDERS = {
  MALE: 'MALE',
  FEMALE: 'FEMALE',
  OTHER: 'OTHER',
  PREFER_NOT_TO_SAY: 'PREFER_NOT_TO_SAY',
} as const;

export type PatientGender = (typeof PATIENT_GENDERS)[keyof typeof PATIENT_GENDERS];

export const BODY_REGIONS = [
  'face',
  'neck',
  'scalp',
  'chest',
  'back',
  'arms',
  'legs',
  'hands',
  'feet',
] as const;

export const FACE_SUB_REGIONS = [
  'forehead',
  'cheeks',
  'chin',
  'nose',
  'periorbital',
] as const;

export const PROCEDURE_CATEGORIES = [
  'laser',
  'injectable',
  'topical',
  'surgical',
  'other',
] as const;

export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

export const API_TIMEOUT = 30000;