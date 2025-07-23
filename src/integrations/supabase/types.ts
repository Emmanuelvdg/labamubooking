export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      addon_integrations: {
        Row: {
          api_credentials: Json | null
          configuration: Json
          created_at: string
          id: string
          integration_type: string
          is_enabled: boolean
          last_sync_at: string | null
          sync_settings: Json | null
          tenant_id: string
          updated_at: string
        }
        Insert: {
          api_credentials?: Json | null
          configuration?: Json
          created_at?: string
          id?: string
          integration_type: string
          is_enabled?: boolean
          last_sync_at?: string | null
          sync_settings?: Json | null
          tenant_id: string
          updated_at?: string
        }
        Update: {
          api_credentials?: Json | null
          configuration?: Json
          created_at?: string
          id?: string
          integration_type?: string
          is_enabled?: boolean
          last_sync_at?: string | null
          sync_settings?: Json | null
          tenant_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string
          details: Json | null
          id: string
          ip_address: unknown | null
          resource_id: string | null
          resource_type: Database["public"]["Enums"]["resource_type"] | null
          staff_id: string | null
          tenant_id: string
          user_agent: string | null
        }
        Insert: {
          action: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          resource_id?: string | null
          resource_type?: Database["public"]["Enums"]["resource_type"] | null
          staff_id?: string | null
          tenant_id: string
          user_agent?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          resource_id?: string | null
          resource_type?: Database["public"]["Enums"]["resource_type"] | null
          staff_id?: string | null
          tenant_id?: string
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
        ]
      }
      automated_message_types: {
        Row: {
          category: string
          created_at: string
          default_template: string | null
          default_timing_hours: number | null
          description: string | null
          id: string
          is_active: boolean
          name: string
        }
        Insert: {
          category: string
          created_at?: string
          default_template?: string | null
          default_timing_hours?: number | null
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
        }
        Update: {
          category?: string
          created_at?: string
          default_template?: string | null
          default_timing_hours?: number | null
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
        }
        Relationships: []
      }
      availability_slots: {
        Row: {
          booking_id: string | null
          created_at: string
          end_time: string
          id: string
          is_available: boolean
          is_booked: boolean
          service_id: string
          staff_id: string
          start_time: string
          tenant_id: string
        }
        Insert: {
          booking_id?: string | null
          created_at?: string
          end_time: string
          id?: string
          is_available?: boolean
          is_booked?: boolean
          service_id: string
          staff_id: string
          start_time: string
          tenant_id: string
        }
        Update: {
          booking_id?: string | null
          created_at?: string
          end_time?: string
          id?: string
          is_available?: boolean
          is_booked?: boolean
          service_id?: string
          staff_id?: string
          start_time?: string
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "availability_slots_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "online_bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "availability_slots_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "availability_slots_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "availability_slots_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      booking_conflicts: {
        Row: {
          booking_id: string
          conflict_type: string
          conflicting_booking_id: string
          created_at: string
          id: string
          resolved: boolean
          resolved_at: string | null
          severity: string
        }
        Insert: {
          booking_id: string
          conflict_type: string
          conflicting_booking_id: string
          created_at?: string
          id?: string
          resolved?: boolean
          resolved_at?: string | null
          severity?: string
        }
        Update: {
          booking_id?: string
          conflict_type?: string
          conflicting_booking_id?: string
          created_at?: string
          id?: string
          resolved?: boolean
          resolved_at?: string | null
          severity?: string
        }
        Relationships: []
      }
      booking_edits: {
        Row: {
          booking_id: string
          created_at: string
          edit_type: string
          edited_by: string | null
          id: string
          new_values: Json | null
          old_values: Json | null
          reason: string | null
          tenant_id: string
        }
        Insert: {
          booking_id: string
          created_at?: string
          edit_type: string
          edited_by?: string | null
          id?: string
          new_values?: Json | null
          old_values?: Json | null
          reason?: string | null
          tenant_id: string
        }
        Update: {
          booking_id?: string
          created_at?: string
          edit_type?: string
          edited_by?: string | null
          id?: string
          new_values?: Json | null
          old_values?: Json | null
          reason?: string | null
          tenant_id?: string
        }
        Relationships: []
      }
      booking_settings: {
        Row: {
          advance_booking_days: number | null
          allow_same_day_booking: boolean | null
          auto_confirm_bookings: boolean | null
          cancellation_policy: string | null
          created_at: string
          id: string
          max_advance_hours: number | null
          min_advance_hours: number | null
          reminder_hours_before: number | null
          require_customer_notes: boolean | null
          require_customer_phone: boolean | null
          send_confirmation_email: boolean | null
          send_reminder_email: boolean | null
          tenant_id: string
          terms_and_conditions: string | null
          updated_at: string
        }
        Insert: {
          advance_booking_days?: number | null
          allow_same_day_booking?: boolean | null
          auto_confirm_bookings?: boolean | null
          cancellation_policy?: string | null
          created_at?: string
          id?: string
          max_advance_hours?: number | null
          min_advance_hours?: number | null
          reminder_hours_before?: number | null
          require_customer_notes?: boolean | null
          require_customer_phone?: boolean | null
          send_confirmation_email?: boolean | null
          send_reminder_email?: boolean | null
          tenant_id: string
          terms_and_conditions?: string | null
          updated_at?: string
        }
        Update: {
          advance_booking_days?: number | null
          allow_same_day_booking?: boolean | null
          auto_confirm_bookings?: boolean | null
          cancellation_policy?: string | null
          created_at?: string
          id?: string
          max_advance_hours?: number | null
          min_advance_hours?: number | null
          reminder_hours_before?: number | null
          require_customer_notes?: boolean | null
          require_customer_phone?: boolean | null
          send_confirmation_email?: boolean | null
          send_reminder_email?: boolean | null
          tenant_id?: string
          terms_and_conditions?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "booking_settings_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          created_at: string
          customer_id: string
          end_time: string
          id: string
          notes: string | null
          service_id: string
          staff_id: string
          start_time: string
          status: string
          tenant_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          customer_id: string
          end_time: string
          id?: string
          notes?: string | null
          service_id: string
          staff_id: string
          start_time: string
          status?: string
          tenant_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          customer_id?: string
          end_time?: string
          id?: string
          notes?: string | null
          service_id?: string
          staff_id?: string
          start_time?: string
          status?: string
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      business_types: {
        Row: {
          created_at: string
          display_order: number
          id: string
          is_active: boolean
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      commission_records: {
        Row: {
          booking_id: string
          commission_amount: number
          commission_scheme_id: string
          commission_type: Database["public"]["Enums"]["commission_type"]
          commission_value: number
          created_at: string
          id: string
          is_paid: boolean
          paid_at: string | null
          service_id: string
          service_price: number
          staff_id: string
          tenant_id: string
          updated_at: string
        }
        Insert: {
          booking_id: string
          commission_amount: number
          commission_scheme_id: string
          commission_type: Database["public"]["Enums"]["commission_type"]
          commission_value: number
          created_at?: string
          id?: string
          is_paid?: boolean
          paid_at?: string | null
          service_id: string
          service_price: number
          staff_id: string
          tenant_id: string
          updated_at?: string
        }
        Update: {
          booking_id?: string
          commission_amount?: number
          commission_scheme_id?: string
          commission_type?: Database["public"]["Enums"]["commission_type"]
          commission_value?: number
          created_at?: string
          id?: string
          is_paid?: boolean
          paid_at?: string | null
          service_id?: string
          service_price?: number
          staff_id?: string
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "commission_records_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commission_records_commission_scheme_id_fkey"
            columns: ["commission_scheme_id"]
            isOneToOne: false
            referencedRelation: "commission_schemes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commission_records_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commission_records_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commission_records_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      commission_schemes: {
        Row: {
          commission_type: Database["public"]["Enums"]["commission_type"]
          commission_value: number
          created_at: string
          id: string
          is_active: boolean
          service_id: string | null
          staff_id: string
          tenant_id: string
          updated_at: string
        }
        Insert: {
          commission_type?: Database["public"]["Enums"]["commission_type"]
          commission_value: number
          created_at?: string
          id?: string
          is_active?: boolean
          service_id?: string | null
          staff_id: string
          tenant_id: string
          updated_at?: string
        }
        Update: {
          commission_type?: Database["public"]["Enums"]["commission_type"]
          commission_value?: number
          created_at?: string
          id?: string
          is_active?: boolean
          service_id?: string | null
          staff_id?: string
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "commission_schemes_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commission_schemes_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commission_schemes_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          avatar: string | null
          birth_date: string | null
          created_at: string
          email: string
          id: string
          name: string
          phone: string | null
          tenant_id: string
          updated_at: string
        }
        Insert: {
          avatar?: string | null
          birth_date?: string | null
          created_at?: string
          email: string
          id?: string
          name: string
          phone?: string | null
          tenant_id: string
          updated_at?: string
        }
        Update: {
          avatar?: string | null
          birth_date?: string | null
          created_at?: string
          email?: string
          id?: string
          name?: string
          phone?: string | null
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "customers_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      external_bookings: {
        Row: {
          created_at: string
          customer_email: string | null
          customer_name: string
          customer_phone: string | null
          end_time: string
          external_booking_id: string
          external_data: Json | null
          id: string
          integration_type: string
          notes: string | null
          service_name: string
          staff_name: string | null
          start_time: string
          status: string
          synced_booking_id: string | null
          tenant_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          customer_email?: string | null
          customer_name: string
          customer_phone?: string | null
          end_time: string
          external_booking_id: string
          external_data?: Json | null
          id?: string
          integration_type: string
          notes?: string | null
          service_name: string
          staff_name?: string | null
          start_time: string
          status?: string
          synced_booking_id?: string | null
          tenant_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          customer_email?: string | null
          customer_name?: string
          customer_phone?: string | null
          end_time?: string
          external_booking_id?: string
          external_data?: Json | null
          id?: string
          integration_type?: string
          notes?: string | null
          service_name?: string
          staff_name?: string | null
          start_time?: string
          status?: string
          synced_booking_id?: string | null
          tenant_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      integration_sync_logs: {
        Row: {
          completed_at: string | null
          created_at: string
          error_details: Json | null
          id: string
          integration_type: string
          records_failed: number | null
          records_processed: number | null
          started_at: string
          status: string
          sync_type: string
          tenant_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          error_details?: Json | null
          id?: string
          integration_type: string
          records_failed?: number | null
          records_processed?: number | null
          started_at?: string
          status: string
          sync_type: string
          tenant_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          error_details?: Json | null
          id?: string
          integration_type?: string
          records_failed?: number | null
          records_processed?: number | null
          started_at?: string
          status?: string
          sync_type?: string
          tenant_id?: string
        }
        Relationships: []
      }
      online_bookings: {
        Row: {
          booking_reference: string | null
          cancellation_token: string | null
          confirmation_token: string | null
          created_at: string
          customer_email: string
          customer_name: string
          customer_notes: string | null
          customer_phone: string | null
          end_time: string
          id: string
          internal_notes: string | null
          service_id: string
          source: string | null
          staff_id: string
          start_time: string
          status: Database["public"]["Enums"]["booking_status"]
          tenant_id: string
          total_price: number | null
          updated_at: string
        }
        Insert: {
          booking_reference?: string | null
          cancellation_token?: string | null
          confirmation_token?: string | null
          created_at?: string
          customer_email: string
          customer_name: string
          customer_notes?: string | null
          customer_phone?: string | null
          end_time: string
          id?: string
          internal_notes?: string | null
          service_id: string
          source?: string | null
          staff_id: string
          start_time: string
          status?: Database["public"]["Enums"]["booking_status"]
          tenant_id: string
          total_price?: number | null
          updated_at?: string
        }
        Update: {
          booking_reference?: string | null
          cancellation_token?: string | null
          confirmation_token?: string | null
          created_at?: string
          customer_email?: string
          customer_name?: string
          customer_notes?: string | null
          customer_phone?: string | null
          end_time?: string
          id?: string
          internal_notes?: string | null
          service_id?: string
          source?: string | null
          staff_id?: string
          start_time?: string
          status?: Database["public"]["Enums"]["booking_status"]
          tenant_id?: string
          total_price?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "online_bookings_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "online_bookings_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "online_bookings_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      permissions: {
        Row: {
          created_at: string
          description: string | null
          id: string
          permission: Database["public"]["Enums"]["permission_type"]
          resource: Database["public"]["Enums"]["resource_type"]
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          permission: Database["public"]["Enums"]["permission_type"]
          resource: Database["public"]["Enums"]["resource_type"]
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          permission?: Database["public"]["Enums"]["permission_type"]
          resource?: Database["public"]["Enums"]["resource_type"]
        }
        Relationships: []
      }
      public_business_profiles: {
        Row: {
          address: string | null
          business_hours: Json | null
          contact_email: string | null
          contact_phone: string | null
          cover_image_url: string | null
          created_at: string
          description: string | null
          display_name: string
          id: string
          is_active: boolean
          logo_url: string | null
          seo_description: string | null
          seo_title: string | null
          slug: string
          social_links: Json | null
          tenant_id: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          business_hours?: Json | null
          contact_email?: string | null
          contact_phone?: string | null
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          display_name: string
          id?: string
          is_active?: boolean
          logo_url?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          social_links?: Json | null
          tenant_id: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          business_hours?: Json | null
          contact_email?: string | null
          contact_phone?: string | null
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          display_name?: string
          id?: string
          is_active?: boolean
          logo_url?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          social_links?: Json | null
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_business_profiles_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      public_service_profiles: {
        Row: {
          created_at: string
          description: string | null
          display_name: string
          display_order: number | null
          features: string[] | null
          id: string
          image_url: string | null
          is_visible: boolean
          online_booking_enabled: boolean
          service_id: string
          tenant_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_name: string
          display_order?: number | null
          features?: string[] | null
          id?: string
          image_url?: string | null
          is_visible?: boolean
          online_booking_enabled?: boolean
          service_id: string
          tenant_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_name?: string
          display_order?: number | null
          features?: string[] | null
          id?: string
          image_url?: string | null
          is_visible?: boolean
          online_booking_enabled?: boolean
          service_id?: string
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_service_profiles_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_service_profiles_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      public_staff_profiles: {
        Row: {
          bio: string | null
          created_at: string
          display_name: string
          display_order: number | null
          id: string
          is_visible: boolean
          profile_image_url: string | null
          specialties: string[] | null
          staff_id: string
          tenant_id: string
          updated_at: string
          years_experience: number | null
        }
        Insert: {
          bio?: string | null
          created_at?: string
          display_name: string
          display_order?: number | null
          id?: string
          is_visible?: boolean
          profile_image_url?: string | null
          specialties?: string[] | null
          staff_id: string
          tenant_id: string
          updated_at?: string
          years_experience?: number | null
        }
        Update: {
          bio?: string | null
          created_at?: string
          display_name?: string
          display_order?: number | null
          id?: string
          is_visible?: boolean
          profile_image_url?: string | null
          specialties?: string[] | null
          staff_id?: string
          tenant_id?: string
          updated_at?: string
          years_experience?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "public_staff_profiles_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_staff_profiles_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      reminder_configurations: {
        Row: {
          channel: string
          created_at: string
          enabled: boolean
          id: string
          message_template: string | null
          reminder_type: string
          tenant_id: string
          timing_hours: number | null
          updated_at: string
        }
        Insert: {
          channel: string
          created_at?: string
          enabled?: boolean
          id?: string
          message_template?: string | null
          reminder_type: string
          tenant_id: string
          timing_hours?: number | null
          updated_at?: string
        }
        Update: {
          channel?: string
          created_at?: string
          enabled?: boolean
          id?: string
          message_template?: string | null
          reminder_type?: string
          tenant_id?: string
          timing_hours?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      roster_assignments: {
        Row: {
          assignment_type: string
          created_at: string
          created_by: string | null
          end_time: string
          id: string
          notes: string | null
          staff_id: string
          start_time: string
          status: string
          tenant_id: string
          updated_at: string
        }
        Insert: {
          assignment_type?: string
          created_at?: string
          created_by?: string | null
          end_time: string
          id?: string
          notes?: string | null
          staff_id: string
          start_time: string
          status?: string
          tenant_id: string
          updated_at?: string
        }
        Update: {
          assignment_type?: string
          created_at?: string
          created_by?: string | null
          end_time?: string
          id?: string
          notes?: string | null
          staff_id?: string
          start_time?: string
          status?: string
          tenant_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      roster_conflicts: {
        Row: {
          assignment_id: string
          conflict_type: string
          created_at: string
          id: string
          is_resolved: boolean
          message: string
          resolved_at: string | null
          severity: string
          tenant_id: string
        }
        Insert: {
          assignment_id: string
          conflict_type: string
          created_at?: string
          id?: string
          is_resolved?: boolean
          message: string
          resolved_at?: string | null
          severity?: string
          tenant_id: string
        }
        Update: {
          assignment_id?: string
          conflict_type?: string
          created_at?: string
          id?: string
          is_resolved?: boolean
          message?: string
          resolved_at?: string | null
          severity?: string
          tenant_id?: string
        }
        Relationships: []
      }
      roster_templates: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean
          name: string
          template_data: Json
          tenant_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          template_data?: Json
          tenant_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          template_data?: Json
          tenant_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      service_categories: {
        Row: {
          color: string | null
          created_at: string
          description: string | null
          id: string
          name: string
          tenant_id: string
          updated_at: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
          tenant_id: string
          updated_at?: string
        }
        Update: {
          color?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          tenant_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          category_id: string | null
          created_at: string
          description: string | null
          duration: number
          id: string
          name: string
          price: number
          tenant_id: string
          updated_at: string
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          description?: string | null
          duration: number
          id?: string
          name: string
          price: number
          tenant_id: string
          updated_at?: string
        }
        Update: {
          category_id?: string | null
          created_at?: string
          description?: string | null
          duration?: number
          id?: string
          name?: string
          price?: number
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "services_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "service_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "services_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      staff: {
        Row: {
          avatar: string | null
          created_at: string
          email: string
          id: string
          is_active: boolean
          name: string
          role: string
          role_id: string | null
          skills: string[] | null
          tenant_id: string
          updated_at: string
        }
        Insert: {
          avatar?: string | null
          created_at?: string
          email: string
          id?: string
          is_active?: boolean
          name: string
          role: string
          role_id?: string | null
          skills?: string[] | null
          tenant_id: string
          updated_at?: string
        }
        Update: {
          avatar?: string | null
          created_at?: string
          email?: string
          id?: string
          is_active?: boolean
          name?: string
          role?: string
          role_id?: string | null
          skills?: string[] | null
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "staff_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "staff_roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "staff_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      staff_accounts: {
        Row: {
          created_at: string
          email: string
          id: string
          is_active: boolean
          last_login: string | null
          password_hash: string
          staff_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          is_active?: boolean
          last_login?: string | null
          password_hash: string
          staff_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          is_active?: boolean
          last_login?: string | null
          password_hash?: string
          staff_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "staff_accounts_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: true
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
        ]
      }
      staff_availability: {
        Row: {
          created_at: string
          day_of_week: number
          end_time: string
          id: string
          is_available: boolean
          staff_id: string
          start_time: string
          tenant_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          day_of_week: number
          end_time: string
          id?: string
          is_available?: boolean
          staff_id: string
          start_time: string
          tenant_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          day_of_week?: number
          end_time?: string
          id?: string
          is_available?: boolean
          staff_id?: string
          start_time?: string
          tenant_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      staff_permissions: {
        Row: {
          created_at: string
          granted_at: string
          granted_by: string | null
          id: string
          permission_id: string
          staff_id: string
        }
        Insert: {
          created_at?: string
          granted_at?: string
          granted_by?: string | null
          id?: string
          permission_id: string
          staff_id: string
        }
        Update: {
          created_at?: string
          granted_at?: string
          granted_by?: string | null
          id?: string
          permission_id?: string
          staff_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "staff_permissions_granted_by_fkey"
            columns: ["granted_by"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "staff_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "staff_permissions_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
        ]
      }
      staff_roles: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          permissions: Json | null
          tenant_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          permissions?: Json | null
          tenant_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          permissions?: Json | null
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "staff_roles_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      staff_schedule_exceptions: {
        Row: {
          created_at: string
          exception_date: string
          id: string
          is_cancelled: boolean
          new_end_time: string | null
          new_start_time: string | null
          reason: string | null
          schedule_id: string
          tenant_id: string
        }
        Insert: {
          created_at?: string
          exception_date: string
          id?: string
          is_cancelled?: boolean
          new_end_time?: string | null
          new_start_time?: string | null
          reason?: string | null
          schedule_id: string
          tenant_id: string
        }
        Update: {
          created_at?: string
          exception_date?: string
          id?: string
          is_cancelled?: boolean
          new_end_time?: string | null
          new_start_time?: string | null
          reason?: string | null
          schedule_id?: string
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_schedule_exceptions_schedule"
            columns: ["schedule_id"]
            isOneToOne: false
            referencedRelation: "staff_schedules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_schedule_exceptions_tenant"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      staff_schedule_templates: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean
          name: string
          tenant_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          tenant_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_schedule_templates_creator"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_schedule_templates_tenant"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      staff_schedules: {
        Row: {
          created_at: string
          description: string | null
          end_time: string
          id: string
          is_recurring: boolean
          repeat_count: number | null
          repeat_end_date: string | null
          repeat_interval: number | null
          repeat_type: Database["public"]["Enums"]["repeat_type"]
          staff_id: string
          start_time: string
          tenant_id: string
          title: string
          updated_at: string
          weekly_pattern: Database["public"]["Enums"]["day_of_week"][] | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          end_time: string
          id?: string
          is_recurring?: boolean
          repeat_count?: number | null
          repeat_end_date?: string | null
          repeat_interval?: number | null
          repeat_type?: Database["public"]["Enums"]["repeat_type"]
          staff_id: string
          start_time: string
          tenant_id: string
          title: string
          updated_at?: string
          weekly_pattern?: Database["public"]["Enums"]["day_of_week"][] | null
        }
        Update: {
          created_at?: string
          description?: string | null
          end_time?: string
          id?: string
          is_recurring?: boolean
          repeat_count?: number | null
          repeat_end_date?: string | null
          repeat_interval?: number | null
          repeat_type?: Database["public"]["Enums"]["repeat_type"]
          staff_id?: string
          start_time?: string
          tenant_id?: string
          title?: string
          updated_at?: string
          weekly_pattern?: Database["public"]["Enums"]["day_of_week"][] | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_staff_schedules_staff"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_staff_schedules_tenant"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      template_schedule_items: {
        Row: {
          created_at: string
          day_of_week: Database["public"]["Enums"]["day_of_week"]
          description: string | null
          end_time: string
          id: string
          start_time: string
          template_id: string
          title: string
        }
        Insert: {
          created_at?: string
          day_of_week: Database["public"]["Enums"]["day_of_week"]
          description?: string | null
          end_time: string
          id?: string
          start_time: string
          template_id: string
          title: string
        }
        Update: {
          created_at?: string
          day_of_week?: Database["public"]["Enums"]["day_of_week"]
          description?: string | null
          end_time?: string
          id?: string
          start_time?: string
          template_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_template_items_template"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "staff_schedule_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      tenant_audit_log: {
        Row: {
          action: string
          created_at: string
          id: string
          ip_address: unknown | null
          new_values: Json | null
          old_values: Json | null
          resource_id: string | null
          resource_type: string | null
          tenant_id: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          resource_id?: string | null
          resource_type?: string | null
          tenant_id: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          resource_id?: string | null
          resource_type?: string | null
          tenant_id?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tenant_audit_log_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      tenant_context: {
        Row: {
          created_at: string
          expires_at: string
          id: string
          is_active: boolean
          last_accessed: string
          session_token: string
          tenant_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at?: string
          id?: string
          is_active?: boolean
          last_accessed?: string
          session_token: string
          tenant_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: string
          is_active?: boolean
          last_accessed?: string
          session_token?: string
          tenant_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tenant_context_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      tenants: {
        Row: {
          business_type: string
          created_at: string
          description: string | null
          email: string
          id: string
          name: string
          owner_name: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          business_type: string
          created_at?: string
          description?: string | null
          email: string
          id?: string
          name: string
          owner_name: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          business_type?: string
          created_at?: string
          description?: string | null
          email?: string
          id?: string
          name?: string
          owner_name?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      user_tenants: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          role: string
          tenant_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          role?: string
          tenant_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          role?: string
          tenant_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_tenants_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      waitlist_entries: {
        Row: {
          called_at: string | null
          cancelled_at: string | null
          created_at: string
          customer_id: string
          estimated_wait_minutes: number | null
          id: string
          notes: string | null
          preferred_staff_id: string | null
          queue_position: number
          served_at: string | null
          service_id: string
          status: string
          tenant_id: string
          updated_at: string
        }
        Insert: {
          called_at?: string | null
          cancelled_at?: string | null
          created_at?: string
          customer_id: string
          estimated_wait_minutes?: number | null
          id?: string
          notes?: string | null
          preferred_staff_id?: string | null
          queue_position?: number
          served_at?: string | null
          service_id: string
          status?: string
          tenant_id: string
          updated_at?: string
        }
        Update: {
          called_at?: string | null
          cancelled_at?: string | null
          created_at?: string
          customer_id?: string
          estimated_wait_minutes?: number | null
          id?: string
          notes?: string | null
          preferred_staff_id?: string | null
          queue_position?: number
          served_at?: string | null
          service_id?: string
          status?: string
          tenant_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      waitlist_notifications: {
        Row: {
          channel: string
          created_at: string
          id: string
          message: string
          notification_type: string
          recipient: string
          sent_at: string | null
          status: string
          waitlist_entry_id: string
        }
        Insert: {
          channel: string
          created_at?: string
          id?: string
          message: string
          notification_type: string
          recipient: string
          sent_at?: string | null
          status?: string
          waitlist_entry_id: string
        }
        Update: {
          channel?: string
          created_at?: string
          id?: string
          message?: string
          notification_type?: string
          recipient?: string
          sent_at?: string | null
          status?: string
          waitlist_entry_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "waitlist_notifications_waitlist_entry_id_fkey"
            columns: ["waitlist_entry_id"]
            isOneToOne: false
            referencedRelation: "waitlist_entries"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_booking_conflicts: {
        Args: {
          p_booking_id: string
          p_staff_id: string
          p_start_time: string
          p_end_time: string
          p_tenant_id: string
        }
        Returns: {
          conflict_id: string
          conflicting_booking_id: string
          conflict_type: string
          severity: string
        }[]
      }
      check_online_booking_conflicts: {
        Args: {
          p_tenant_id: string
          p_staff_id: string
          p_start_time: string
          p_end_time: string
          p_exclude_booking_id?: string
        }
        Returns: boolean
      }
      check_roster_conflicts: {
        Args: {
          p_assignment_id: string
          p_staff_id: string
          p_start_time: string
          p_end_time: string
          p_tenant_id: string
        }
        Returns: {
          conflict_id: string
          conflict_type: string
          severity: string
          message: string
        }[]
      }
      generate_availability_slots_comprehensive: {
        Args: { p_tenant_id: string; p_start_date: string; p_end_date: string }
        Returns: number
      }
      generate_booking_reference: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_roster_from_template: {
        Args: {
          p_template_id: string
          p_start_date: string
          p_end_date: string
          p_tenant_id: string
        }
        Returns: number
      }
      generate_schedule_instances: {
        Args: { schedule_id: string; start_date: string; end_date: string }
        Returns: {
          instance_date: string
          start_time: string
          end_time: string
          title: string
          description: string
          staff_id: string
          has_exception: boolean
        }[]
      }
      get_current_tenant_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_staff_working_periods: {
        Args: {
          p_staff_id: string
          p_tenant_id: string
          p_start_date: string
          p_end_date: string
        }
        Returns: {
          source_type: string
          start_time: string
          end_time: string
          title: string
          description: string
        }[]
      }
      get_user_tenant_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      log_action: {
        Args: {
          tenant_uuid: string
          staff_uuid: string
          action_name: string
          resource_type_name?: Database["public"]["Enums"]["resource_type"]
          resource_uuid?: string
          action_details?: Json
        }
        Returns: string
      }
      log_booking_edit: {
        Args: {
          p_booking_id: string
          p_tenant_id: string
          p_edited_by: string
          p_edit_type: string
          p_old_values: Json
          p_new_values: Json
          p_reason?: string
        }
        Returns: string
      }
      log_tenant_operation: {
        Args: {
          p_action: string
          p_resource_type?: string
          p_resource_id?: string
          p_old_values?: Json
          p_new_values?: Json
        }
        Returns: string
      }
      refresh_tenant_context: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      set_tenant_context: {
        Args: { p_tenant_id: string; p_session_token?: string }
        Returns: string
      }
      staff_has_permission: {
        Args: {
          staff_uuid: string
          resource_name: Database["public"]["Enums"]["resource_type"]
          permission_name: Database["public"]["Enums"]["permission_type"]
        }
        Returns: boolean
      }
      user_belongs_to_tenant: {
        Args: { tenant_uuid: string }
        Returns: boolean
      }
    }
    Enums: {
      booking_status:
        | "pending"
        | "confirmed"
        | "cancelled"
        | "completed"
        | "no_show"
      commission_type: "percentage" | "nominal"
      day_of_week:
        | "monday"
        | "tuesday"
        | "wednesday"
        | "thursday"
        | "friday"
        | "saturday"
        | "sunday"
      permission_type: "read" | "write" | "delete" | "admin"
      repeat_type: "none" | "daily" | "weekly" | "monthly"
      resource_type:
        | "staff"
        | "customers"
        | "bookings"
        | "services"
        | "calendar"
        | "commissions"
        | "settings"
        | "dashboard"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      booking_status: [
        "pending",
        "confirmed",
        "cancelled",
        "completed",
        "no_show",
      ],
      commission_type: ["percentage", "nominal"],
      day_of_week: [
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday",
      ],
      permission_type: ["read", "write", "delete", "admin"],
      repeat_type: ["none", "daily", "weekly", "monthly"],
      resource_type: [
        "staff",
        "customers",
        "bookings",
        "services",
        "calendar",
        "commissions",
        "settings",
        "dashboard",
      ],
    },
  },
} as const
