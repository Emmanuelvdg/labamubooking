
export interface PublicBusinessProfile {
  id: string;
  tenantId: string;
  slug: string;
  displayName: string;
  description?: string;
  logoUrl?: string;
  coverImageUrl?: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  businessHours?: Record<string, any>;
  socialLinks?: Record<string, any>;
  isActive: boolean;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BookingSettings {
  id: string;
  tenantId: string;
  advanceBookingDays: number;
  minAdvanceHours: number;
  maxAdvanceHours: number;
  allowSameDayBooking: boolean;
  requireCustomerPhone: boolean;
  requireCustomerNotes: boolean;
  autoConfirmBookings: boolean;
  sendConfirmationEmail: boolean;
  sendReminderEmail: boolean;
  reminderHoursBefore: number;
  cancellationPolicy?: string;
  termsAndConditions?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PublicStaffProfile {
  id: string;
  staffId: string;
  tenantId: string;
  displayName: string;
  bio?: string;
  profileImageUrl?: string;
  specialties: string[];
  yearsExperience?: number;
  isVisible: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface PublicServiceProfile {
  id: string;
  serviceId: string;
  tenantId: string;
  displayName: string;
  description?: string;
  imageUrl?: string;
  features: string[];
  isVisible: boolean;
  displayOrder: number;
  onlineBookingEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export type OnlineBookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no_show';

export interface OnlineBooking {
  id: string;
  tenantId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  serviceId: string;
  staffId: string;
  startTime: string;
  endTime: string;
  status: OnlineBookingStatus;
  customerNotes?: string;
  internalNotes?: string;
  confirmationToken: string;
  cancellationToken: string;
  totalPrice?: number;
  bookingReference: string;
  source: string;
  createdAt: string;
  updatedAt: string;
}

export interface AvailabilitySlot {
  id: string;
  tenantId: string;
  staffId: string;
  serviceId: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  isBooked: boolean;
  bookingId?: string;
  createdAt: string;
}

export interface OnlineBookingFormData {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  serviceId: string;
  staffId: string;
  startTime: string;
  customerNotes?: string;
}
