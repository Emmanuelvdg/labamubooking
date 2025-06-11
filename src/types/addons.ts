
export interface AddonIntegration {
  id: string;
  tenant_id: string;
  integration_type: 'google_reserve' | 'facebook_booking' | 'instagram_booking';
  is_enabled: boolean;
  configuration: Record<string, any>;
  api_credentials: Record<string, any>;
  sync_settings: Record<string, any>;
  last_sync_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ExternalBooking {
  id: string;
  tenant_id: string;
  integration_type: 'google_reserve' | 'facebook_booking' | 'instagram_booking';
  external_booking_id: string;
  customer_name: string;
  customer_email: string | null;
  customer_phone: string | null;
  service_name: string;
  staff_name: string | null;
  start_time: string;
  end_time: string;
  status: string;
  notes: string | null;
  external_data: Record<string, any>;
  synced_booking_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface IntegrationSyncLog {
  id: string;
  tenant_id: string;
  integration_type: string;
  sync_type: 'import' | 'export' | 'update' | 'delete';
  status: 'success' | 'error' | 'partial';
  records_processed: number | null;
  records_failed: number | null;
  error_details: Record<string, any>;
  started_at: string;
  completed_at: string | null;
  created_at: string;
}
