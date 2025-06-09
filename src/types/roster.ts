
export interface RosterAssignment {
  id: string;
  tenantId: string;
  staffId: string;
  startTime: string;
  endTime: string;
  status: 'scheduled' | 'confirmed' | 'cancelled' | 'completed';
  assignmentType: 'regular' | 'template' | 'overtime' | 'emergency';
  notes?: string;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
  staff?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export interface RosterTemplate {
  id: string;
  tenantId: string;
  name: string;
  description?: string;
  isActive: boolean;
  templateData: TemplateItem[];
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TemplateItem {
  staffId: string;
  dayOfWeek: number; // 0 = Sunday, 6 = Saturday
  startTime: string;
  endTime: string;
  notes?: string;
}

export interface StaffAvailability {
  id: string;
  tenantId: string;
  staffId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RosterConflict {
  id: string;
  tenantId: string;
  assignmentId: string;
  conflictType: 'overlap' | 'availability' | 'overtime' | 'double_booking';
  severity: 'info' | 'warning' | 'error';
  message: string;
  isResolved: boolean;
  createdAt: string;
  resolvedAt?: string;
}
