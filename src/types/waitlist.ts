
export interface WaitlistEntry {
  id: string;
  tenant_id: string;
  customer_id: string;
  service_id: string;
  preferred_staff_id?: string;
  queue_position: number;
  status: 'waiting' | 'called' | 'served' | 'cancelled' | 'no_show';
  estimated_wait_minutes?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
  called_at?: string;
  served_at?: string;
  cancelled_at?: string;
  // Joined data
  customer?: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  };
  service?: {
    id: string;
    name: string;
    duration: number;
    price: number;
  };
  preferred_staff?: {
    id: string;
    name: string;
  };
}

export interface WaitlistEntryInsert {
  customer_id: string;
  service_id: string;
  preferred_staff_id?: string;
  estimated_wait_minutes?: number;
  notes?: string;
  status: 'waiting' | 'called' | 'served' | 'cancelled' | 'no_show';
  tenant_id: string;
  queue_position?: number; // Optional because database trigger will set it
}

export interface WaitlistNotification {
  id: string;
  waitlist_entry_id: string;
  notification_type: 'position_update' | 'ready_soon' | 'ready_now' | 'cancelled';
  channel: 'sms' | 'email' | 'app';
  recipient: string;
  message: string;
  sent_at?: string;
  status: 'pending' | 'sent' | 'failed';
  created_at: string;
}
