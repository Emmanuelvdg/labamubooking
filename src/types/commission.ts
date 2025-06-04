
export interface CommissionScheme {
  id: string;
  tenantId: string;
  staffId: string;
  serviceId?: string;
  commissionType: 'percentage' | 'nominal';
  commissionValue: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  staff?: {
    id: string;
    name: string;
  };
  service?: {
    id: string;
    name: string;
  };
}

export interface CommissionRecord {
  id: string;
  tenantId: string;
  bookingId: string;
  staffId: string;
  serviceId: string;
  commissionSchemeId: string;
  servicePrice: number;
  commissionType: 'percentage' | 'nominal';
  commissionValue: number;
  commissionAmount: number;
  isPaid: boolean;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
  staff: {
    id: string;
    name: string;
  };
  service: {
    id: string;
    name: string;
  };
}
