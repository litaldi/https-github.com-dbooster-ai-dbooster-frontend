export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      admin_bootstrap_log: {
        Row: {
          bootstrap_method: string | null
          created_at: string
          created_by: string | null
          first_admin_created: boolean | null
          id: string
          ip_address: unknown | null
          user_agent: string | null
        }
        Insert: {
          bootstrap_method?: string | null
          created_at?: string
          created_by?: string | null
          first_admin_created?: boolean | null
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
        }
        Update: {
          bootstrap_method?: string | null
          created_at?: string
          created_by?: string | null
          first_admin_created?: boolean | null
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
        }
        Relationships: []
      }
      admin_bootstrap_validation: {
        Row: {
          bootstrap_token: string
          created_at: string
          created_by_ip: unknown | null
          expires_at: string
          id: string
          is_active: boolean | null
          used_at: string | null
        }
        Insert: {
          bootstrap_token: string
          created_at?: string
          created_by_ip?: unknown | null
          expires_at?: string
          id?: string
          is_active?: boolean | null
          used_at?: string | null
        }
        Update: {
          bootstrap_token?: string
          created_at?: string
          created_by_ip?: unknown | null
          expires_at?: string
          id?: string
          is_active?: boolean | null
          used_at?: string | null
        }
        Relationships: []
      }
      admin_ip_whitelist: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          expires_at: string | null
          id: string
          ip_address: unknown
          is_active: boolean | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          expires_at?: string | null
          id?: string
          ip_address: unknown
          is_active?: boolean | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          expires_at?: string | null
          id?: string
          ip_address?: unknown
          is_active?: boolean | null
        }
        Relationships: []
      }
      cms_media: {
        Row: {
          alt_text: string | null
          created_at: string
          filename: string
          id: string
          mime_type: string
          original_name: string
          size_bytes: number | null
          uploaded_by: string | null
          url: string
        }
        Insert: {
          alt_text?: string | null
          created_at?: string
          filename: string
          id?: string
          mime_type: string
          original_name: string
          size_bytes?: number | null
          uploaded_by?: string | null
          url: string
        }
        Update: {
          alt_text?: string | null
          created_at?: string
          filename?: string
          id?: string
          mime_type?: string
          original_name?: string
          size_bytes?: number | null
          uploaded_by?: string | null
          url?: string
        }
        Relationships: []
      }
      cms_navigation: {
        Row: {
          created_at: string
          id: string
          is_active: boolean | null
          label: string
          parent_id: string | null
          sort_order: number | null
          updated_at: string
          url: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          label: string
          parent_id?: string | null
          sort_order?: number | null
          updated_at?: string
          url: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          label?: string
          parent_id?: string | null
          sort_order?: number | null
          updated_at?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "cms_navigation_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "cms_navigation"
            referencedColumns: ["id"]
          },
        ]
      }
      cms_pages: {
        Row: {
          content: Json | null
          created_at: string
          created_by: string | null
          id: string
          meta_description: string | null
          meta_title: string | null
          published: boolean | null
          slug: string
          title: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          content?: Json | null
          created_at?: string
          created_by?: string | null
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          published?: boolean | null
          slug: string
          title: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          content?: Json | null
          created_at?: string
          created_by?: string | null
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          published?: boolean | null
          slug?: string
          title?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      cms_settings: {
        Row: {
          category: string | null
          created_at: string
          id: string
          is_public: boolean | null
          key: string
          updated_at: string
          value: Json | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          id?: string
          is_public?: boolean | null
          key: string
          updated_at?: string
          value?: Json | null
        }
        Update: {
          category?: string | null
          created_at?: string
          id?: string
          is_public?: boolean | null
          key?: string
          updated_at?: string
          value?: Json | null
        }
        Relationships: []
      }
      comprehensive_security_log: {
        Row: {
          affected_resource: string | null
          auto_blocked: boolean | null
          created_at: string
          event_category: string
          event_data: Json | null
          event_type: string
          id: string
          ip_address: unknown | null
          risk_score: number | null
          session_id: string | null
          severity: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          affected_resource?: string | null
          auto_blocked?: boolean | null
          created_at?: string
          event_category?: string
          event_data?: Json | null
          event_type: string
          id?: string
          ip_address?: unknown | null
          risk_score?: number | null
          session_id?: string | null
          severity?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          affected_resource?: string | null
          auto_blocked?: boolean | null
          created_at?: string
          event_category?: string
          event_data?: Json | null
          event_type?: string
          id?: string
          ip_address?: unknown | null
          risk_score?: number | null
          session_id?: string | null
          severity?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      csp_violation_reports: {
        Row: {
          created_at: string | null
          id: string
          ip_address: unknown | null
          report_data: Json
          user_agent: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          report_data: Json
          user_agent?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          report_data?: Json
          user_agent?: string | null
        }
        Relationships: []
      }
      enhanced_session_tracking: {
        Row: {
          created_at: string
          device_fingerprint: string | null
          expires_at: string | null
          id: string
          ip_address: unknown | null
          is_demo: boolean | null
          last_activity: string | null
          security_score: number | null
          session_id: string
          status: string | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          device_fingerprint?: string | null
          expires_at?: string | null
          id?: string
          ip_address?: unknown | null
          is_demo?: boolean | null
          last_activity?: string | null
          security_score?: number | null
          session_id: string
          status?: string | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          device_fingerprint?: string | null
          expires_at?: string | null
          id?: string
          ip_address?: unknown | null
          is_demo?: boolean | null
          last_activity?: string | null
          security_score?: number | null
          session_id?: string
          status?: string | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      input_validation_log: {
        Row: {
          created_at: string
          id: string
          input_context: string
          ip_address: unknown | null
          sanitized_input: string | null
          threat_detected: boolean | null
          threat_types: string[] | null
          user_id: string | null
          validation_result: Json
        }
        Insert: {
          created_at?: string
          id?: string
          input_context: string
          ip_address?: unknown | null
          sanitized_input?: string | null
          threat_detected?: boolean | null
          threat_types?: string[] | null
          user_id?: string | null
          validation_result: Json
        }
        Update: {
          created_at?: string
          id?: string
          input_context?: string
          ip_address?: unknown | null
          sanitized_input?: string | null
          threat_detected?: boolean | null
          threat_types?: string[] | null
          user_id?: string | null
          validation_result?: Json
        }
        Relationships: []
      }
      persistent_rate_limits: {
        Row: {
          action_type: string
          attempt_count: number | null
          blocked_until: string | null
          created_at: string | null
          id: string
          identifier: string
          metadata: Json | null
          updated_at: string | null
          window_start: string | null
        }
        Insert: {
          action_type: string
          attempt_count?: number | null
          blocked_until?: string | null
          created_at?: string | null
          id?: string
          identifier: string
          metadata?: Json | null
          updated_at?: string | null
          window_start?: string | null
        }
        Update: {
          action_type?: string
          attempt_count?: number | null
          blocked_until?: string | null
          created_at?: string | null
          id?: string
          identifier?: string
          metadata?: Json | null
          updated_at?: string | null
          window_start?: string | null
        }
        Relationships: []
      }
      privilege_escalation_attempts: {
        Row: {
          attempted_role: Database["public"]["Enums"]["app_role"] | null
          blocked: boolean | null
          created_at: string
          id: string
          ip_address: unknown | null
          method: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          attempted_role?: Database["public"]["Enums"]["app_role"] | null
          blocked?: boolean | null
          created_at?: string
          id?: string
          ip_address?: unknown | null
          method?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          attempted_role?: Database["public"]["Enums"]["app_role"] | null
          blocked?: boolean | null
          created_at?: string
          id?: string
          ip_address?: unknown | null
          method?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      queries: {
        Row: {
          created_at: string
          file_path: string
          id: string
          line_number: number
          optimization_suggestion: string | null
          performance_impact: string | null
          query_content: string
          repository_id: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          file_path: string
          id?: string
          line_number: number
          optimization_suggestion?: string | null
          performance_impact?: string | null
          query_content: string
          repository_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          file_path?: string
          id?: string
          line_number?: number
          optimization_suggestion?: string | null
          performance_impact?: string | null
          query_content?: string
          repository_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "queries_repository_id_fkey"
            columns: ["repository_id"]
            isOneToOne: false
            referencedRelation: "repositories"
            referencedColumns: ["id"]
          },
        ]
      }
      rate_limit_tracking: {
        Row: {
          action_type: string
          attempt_count: number | null
          blocked_until: string | null
          created_at: string | null
          id: string
          identifier: string
          updated_at: string | null
          window_start: string | null
        }
        Insert: {
          action_type: string
          attempt_count?: number | null
          blocked_until?: string | null
          created_at?: string | null
          id?: string
          identifier: string
          updated_at?: string | null
          window_start?: string | null
        }
        Update: {
          action_type?: string
          attempt_count?: number | null
          blocked_until?: string | null
          created_at?: string | null
          id?: string
          identifier?: string
          updated_at?: string | null
          window_start?: string | null
        }
        Relationships: []
      }
      repositories: {
        Row: {
          clone_url: string
          created_at: string
          default_branch: string
          description: string | null
          full_name: string
          github_id: number
          html_url: string
          id: string
          language: string | null
          last_scan: string | null
          name: string
          optimizations_count: number
          queries_count: number
          scan_status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          clone_url: string
          created_at?: string
          default_branch?: string
          description?: string | null
          full_name: string
          github_id: number
          html_url: string
          id?: string
          language?: string | null
          last_scan?: string | null
          name: string
          optimizations_count?: number
          queries_count?: number
          scan_status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          clone_url?: string
          created_at?: string
          default_branch?: string
          description?: string | null
          full_name?: string
          github_id?: number
          html_url?: string
          id?: string
          language?: string | null
          last_scan?: string | null
          name?: string
          optimizations_count?: number
          queries_count?: number
          scan_status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      role_assignment_requests: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          created_at: string
          id: string
          reason: string | null
          request_ip: unknown | null
          requested_by: string
          requested_role: Database["public"]["Enums"]["app_role"]
          status: string | null
          target_user_id: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          id?: string
          reason?: string | null
          request_ip?: unknown | null
          requested_by: string
          requested_role: Database["public"]["Enums"]["app_role"]
          status?: string | null
          target_user_id: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          id?: string
          reason?: string | null
          request_ip?: unknown | null
          requested_by?: string
          requested_role?: Database["public"]["Enums"]["app_role"]
          status?: string | null
          target_user_id?: string
        }
        Relationships: []
      }
      role_change_audit: {
        Row: {
          changed_by: string | null
          created_at: string
          id: string
          ip_address: unknown | null
          new_role: Database["public"]["Enums"]["app_role"]
          old_role: Database["public"]["Enums"]["app_role"] | null
          reason: string | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          changed_by?: string | null
          created_at?: string
          id?: string
          ip_address?: unknown | null
          new_role: Database["public"]["Enums"]["app_role"]
          old_role?: Database["public"]["Enums"]["app_role"] | null
          reason?: string | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          changed_by?: string | null
          created_at?: string
          id?: string
          ip_address?: unknown | null
          new_role?: Database["public"]["Enums"]["app_role"]
          old_role?: Database["public"]["Enums"]["app_role"] | null
          reason?: string | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      role_time_restrictions: {
        Row: {
          created_at: string
          days_of_week: number[] | null
          end_time: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          start_time: string | null
          timezone: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          days_of_week?: number[] | null
          end_time?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          start_time?: string | null
          timezone?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          days_of_week?: number[] | null
          end_time?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          start_time?: string | null
          timezone?: string | null
          user_id?: string
        }
        Relationships: []
      }
      secure_session_validation: {
        Row: {
          created_at: string
          device_fingerprint: string | null
          expires_at: string
          id: string
          ip_address: unknown | null
          is_validated: boolean | null
          last_validation: string | null
          security_score: number | null
          session_id: string
          suspicious_activity_count: number | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          device_fingerprint?: string | null
          expires_at?: string
          id?: string
          ip_address?: unknown | null
          is_validated?: boolean | null
          last_validation?: string | null
          security_score?: number | null
          session_id: string
          suspicious_activity_count?: number | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          device_fingerprint?: string | null
          expires_at?: string
          id?: string
          ip_address?: unknown | null
          is_validated?: boolean | null
          last_validation?: string | null
          security_score?: number | null
          session_id?: string
          suspicious_activity_count?: number | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      secure_user_sessions: {
        Row: {
          created_at: string
          device_fingerprint: string | null
          expires_at: string
          id: string
          ip_address: unknown | null
          is_active: boolean | null
          last_activity: string | null
          metadata: Json | null
          security_score: number | null
          session_token: string
          session_token_hash: string | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          device_fingerprint?: string | null
          expires_at?: string
          id?: string
          ip_address?: unknown | null
          is_active?: boolean | null
          last_activity?: string | null
          metadata?: Json | null
          security_score?: number | null
          session_token: string
          session_token_hash?: string | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          device_fingerprint?: string | null
          expires_at?: string
          id?: string
          ip_address?: unknown | null
          is_active?: boolean | null
          last_activity?: string | null
          metadata?: Json | null
          security_score?: number | null
          session_token?: string
          session_token_hash?: string | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      security_audit_log: {
        Row: {
          created_at: string | null
          event_data: Json | null
          event_type: string
          id: string
          ip_address: unknown | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          event_data?: Json | null
          event_type: string
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          event_data?: Json | null
          event_type?: string
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      security_events_enhanced: {
        Row: {
          auto_blocked: boolean | null
          created_at: string
          event_data: Json | null
          event_type: string
          id: string
          ip_address: unknown | null
          session_id: string | null
          severity: string
          threat_score: number | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          auto_blocked?: boolean | null
          created_at?: string
          event_data?: Json | null
          event_type: string
          id?: string
          ip_address?: unknown | null
          session_id?: string | null
          severity: string
          threat_score?: number | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          auto_blocked?: boolean | null
          created_at?: string
          event_data?: Json | null
          event_type?: string
          id?: string
          ip_address?: unknown | null
          session_id?: string | null
          severity?: string
          threat_score?: number | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      session_security_events: {
        Row: {
          blocked: boolean | null
          created_at: string | null
          device_fingerprint: string | null
          event_data: Json | null
          event_type: string
          id: string
          ip_address: unknown | null
          security_score: number | null
          session_id: string
          severity: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          blocked?: boolean | null
          created_at?: string | null
          device_fingerprint?: string | null
          event_data?: Json | null
          event_type: string
          id?: string
          ip_address?: unknown | null
          security_score?: number | null
          session_id: string
          severity?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          blocked?: boolean | null
          created_at?: string | null
          device_fingerprint?: string | null
          event_data?: Json | null
          event_type?: string
          id?: string
          ip_address?: unknown | null
          security_score?: number | null
          session_id?: string
          severity?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_mfa_config: {
        Row: {
          backup_codes: string[] | null
          backup_codes_hashed: string[] | null
          created_at: string | null
          id: string
          is_mfa_enabled: boolean | null
          recovery_codes_used: number | null
          totp_secret: string | null
          totp_secret_encrypted: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          backup_codes?: string[] | null
          backup_codes_hashed?: string[] | null
          created_at?: string | null
          id?: string
          is_mfa_enabled?: boolean | null
          recovery_codes_used?: number | null
          totp_secret?: string | null
          totp_secret_encrypted?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          backup_codes?: string[] | null
          backup_codes_hashed?: string[] | null
          created_at?: string | null
          id?: string
          is_mfa_enabled?: boolean | null
          recovery_codes_used?: number | null
          totp_secret?: string | null
          totp_secret_encrypted?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_password_history: {
        Row: {
          breach_source: string | null
          created_at: string
          id: string
          is_compromised: boolean | null
          password_hash: string
          user_id: string
        }
        Insert: {
          breach_source?: string | null
          created_at?: string
          id?: string
          is_compromised?: boolean | null
          password_hash: string
          user_id: string
        }
        Update: {
          breach_source?: string | null
          created_at?: string
          id?: string
          is_compromised?: boolean | null
          password_hash?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          assigned_at: string | null
          assigned_by: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          assigned_at?: string | null
          assigned_by?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          assigned_at?: string | null
          assigned_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      user_mfa_status: {
        Row: {
          backup_codes_remaining: number | null
          created_at: string | null
          is_mfa_enabled: boolean | null
          recovery_codes_used: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          backup_codes_remaining?: never
          created_at?: string | null
          is_mfa_enabled?: boolean | null
          recovery_codes_used?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          backup_codes_remaining?: never
          created_at?: string | null
          is_mfa_enabled?: boolean | null
          recovery_codes_used?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      approve_role_assignment_request: {
        Args: { approve?: boolean; request_id: string }
        Returns: boolean
      }
      assign_user_role: {
        Args: {
          change_reason?: string
          new_role: Database["public"]["Enums"]["app_role"]
          target_user_id: string
        }
        Returns: boolean
      }
      check_csp_violation_rate_limit: {
        Args: { p_ip_address: unknown }
        Returns: boolean
      }
      cleanup_expired_sessions: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      create_secure_session_with_hash: {
        Args: {
          p_device_fingerprint?: string
          p_ip_address?: unknown
          p_is_demo?: boolean
          p_session_token: string
          p_user_agent?: string
          p_user_id: string
        }
        Returns: Json
      }
      enable_mfa_secure: {
        Args: { user_backup_codes: string[]; user_totp_secret: string }
        Returns: Json
      }
      enhanced_secure_role_assignment: {
        Args: {
          change_reason?: string
          new_role: Database["public"]["Enums"]["app_role"]
          requester_ip?: unknown
          target_user_id: string
          user_agent_header?: string
        }
        Returns: Json
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin_bootstrap_needed: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_role_active_now: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      log_input_validation: {
        Args: {
          p_context: string
          p_ip_address?: unknown
          p_user_id: string
          p_validation_result: Json
        }
        Returns: undefined
      }
      report_csp_violation: {
        Args: { violation_data: Json }
        Returns: Json
      }
      secure_admin_bootstrap: {
        Args: {
          bootstrap_token: string
          requester_ip?: unknown
          target_user_id: string
        }
        Returns: Json
      }
      secure_assign_user_role: {
        Args: {
          change_reason?: string
          new_role: Database["public"]["Enums"]["app_role"]
          requester_ip?: unknown
          target_user_id: string
        }
        Returns: Json
      }
      secure_role_assignment_enhanced: {
        Args: {
          change_reason?: string
          new_role: Database["public"]["Enums"]["app_role"]
          requester_ip?: unknown
          target_user_id: string
          user_agent_header?: string
        }
        Returns: Json
      }
      secure_role_assignment_with_monitoring: {
        Args: {
          change_reason?: string
          new_role: Database["public"]["Enums"]["app_role"]
          requester_ip?: unknown
          target_user_id: string
          user_agent_header?: string
        }
        Returns: Json
      }
      validate_backup_code_secure: {
        Args: { backup_code: string }
        Returns: Json
      }
      validate_secure_session: {
        Args: {
          p_device_fingerprint?: string
          p_ip_address?: unknown
          p_session_token: string
        }
        Returns: Json
      }
      validate_secure_session_by_hash: {
        Args: {
          p_device_fingerprint?: string
          p_ip_address?: unknown
          p_session_token: string
        }
        Returns: Json
      }
      validate_session_security: {
        Args: {
          p_device_fingerprint: string
          p_ip_address: unknown
          p_session_id: string
          p_user_agent: string
        }
        Returns: Json
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
