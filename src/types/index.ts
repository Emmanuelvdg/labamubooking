
export interface Tenant {
  id: string;
  name: string;
  businessType: string;
  createdAt: string;
}

export interface Staff {
  id: string;
  tenantId: string;
  name: string;
  email: string;
  role: string;
  skills: string[];
  avatar?: string;
  isActive: boolean;
}

export interface Customer {
  id: string;
  tenantId: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
}

export interface Service {
  id: string;
  tenantId: string;
  name: string;
  description: string;
  duration: number; // in minutes
  price: number;
}

export interface Booking {
  id: string;
  tenantId: string;
  customerId: string;
  staffId: string;
  serviceId: string;
  startTime: string;
  endTime: string;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  notes?: string;
  customer: Customer;
  staff: Staff;
  service: Service;
}
