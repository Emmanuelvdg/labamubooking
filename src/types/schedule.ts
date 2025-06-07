
export interface StaffSchedule {
  id: string;
  tenantId: string;
  staffId: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  isRecurring: boolean;
  repeatType: 'none' | 'daily' | 'weekly' | 'monthly';
  repeatInterval?: number;
  repeatEndDate?: string;
  repeatCount?: number;
  weeklyPattern?: DayOfWeek[];
  createdAt: string;
  updatedAt: string;
}

export interface ScheduleTemplate {
  id: string;
  tenantId: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TemplateScheduleItem {
  id: string;
  templateId: string;
  title: string;
  description?: string;
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
  createdAt: string;
}

export interface ScheduleException {
  id: string;
  tenantId: string;
  scheduleId: string;
  exceptionDate: string;
  isCancelled: boolean;
  newStartTime?: string;
  newEndTime?: string;
  reason?: string;
  createdAt: string;
}

export interface ScheduleInstance {
  instanceDate: string;
  startTime: string;
  endTime: string;
  title: string;
  description?: string;
  staffId: string;
  hasException: boolean;
}

export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export interface CreateScheduleData {
  tenantId: string;
  staffId: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  isRecurring: boolean;
  repeatType: 'none' | 'daily' | 'weekly' | 'monthly';
  repeatInterval?: number;
  repeatEndDate?: string;
  repeatCount?: number;
  weeklyPattern?: DayOfWeek[];
}

export interface CreateTemplateData {
  tenantId: string;
  name: string;
  description?: string;
  createdBy?: string;
  items: Omit<TemplateScheduleItem, 'id' | 'templateId' | 'createdAt'>[];
}
