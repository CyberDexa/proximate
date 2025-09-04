// Auto-generated types from Supabase
// Run: npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/lib/supabase/database.types.ts

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          email_verified: string | null;
          birth_date: string;
          age_verified: boolean;
          is_verified: boolean;
          image: string | null;
          last_active: string | null;
          suspended: boolean;
          suspended_reason: string | null;
          account_locked: boolean;
          lock_reason: string | null;
          locked_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name?: string | null;
          email_verified?: string | null;
          birth_date: string;
          age_verified?: boolean;
          is_verified?: boolean;
          image?: string | null;
          last_active?: string | null;
          suspended?: boolean;
          suspended_reason?: string | null;
          account_locked?: boolean;
          lock_reason?: string | null;
          locked_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string | null;
          email_verified?: string | null;
          birth_date?: string;
          age_verified?: boolean;
          is_verified?: boolean;
          image?: string | null;
          last_active?: string | null;
          suspended?: boolean;
          suspended_reason?: string | null;
          account_locked?: boolean;
          lock_reason?: string | null;
          locked_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      profiles: {
        Row: {
          id: string;
          user_id: string;
          bio: string | null;
          location: string | null;
          looking_for: string[];
          kinks: string[];
          boundaries: string[];
          deal_breakers: string[];
          discreet_mode: boolean;
          hide_from_contacts: boolean;
          share_location: boolean;
          age_range_min: number;
          age_range_max: number;
          max_distance: number;
          interested_in: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          bio?: string | null;
          location?: string | null;
          looking_for?: string[];
          kinks?: string[];
          boundaries?: string[];
          deal_breakers?: string[];
          discreet_mode?: boolean;
          hide_from_contacts?: boolean;
          share_location?: boolean;
          age_range_min?: number;
          age_range_max?: number;
          max_distance?: number;
          interested_in?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          bio?: string | null;
          location?: string | null;
          looking_for?: string[];
          kinks?: string[];
          boundaries?: string[];
          deal_breakers?: string[];
          discreet_mode?: boolean;
          hide_from_contacts?: boolean;
          share_location?: boolean;
          age_range_min?: number;
          age_range_max?: number;
          max_distance?: number;
          interested_in?: string[];
          created_at?: string;
          updated_at?: string;
        };
      };
      // Add other table types as needed
      matches: {
        Row: {
          id: string;
          user_one_id: string;
          user_two_id: string;
          matched_at: string;
          last_interaction: string | null;
          meetup_planned: boolean;
          meetup_time: string | null;
          consent_confirmed: boolean;
        };
        Insert: {
          id?: string;
          user_one_id: string;
          user_two_id: string;
          matched_at?: string;
          last_interaction?: string | null;
          meetup_planned?: boolean;
          meetup_time?: string | null;
          consent_confirmed?: boolean;
        };
        Update: {
          id?: string;
          user_one_id?: string;
          user_two_id?: string;
          matched_at?: string;
          last_interaction?: string | null;
          meetup_planned?: boolean;
          meetup_time?: string | null;
          consent_confirmed?: boolean;
        };
      };
      likes: {
        Row: {
          id: string;
          giver_id: string;
          receiver_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          giver_id: string;
          receiver_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          giver_id?: string;
          receiver_id?: string;
          created_at?: string;
        };
      };
      passes: {
        Row: {
          id: string;
          giver_id: string;
          receiver_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          giver_id: string;
          receiver_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          giver_id?: string;
          receiver_id?: string;
          created_at?: string;
        };
      };
      super_likes: {
        Row: {
          id: string;
          giver_id: string;
          receiver_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          giver_id: string;
          receiver_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          giver_id?: string;
          receiver_id?: string;
          created_at?: string;
        };
      };
      blocks: {
        Row: {
          id: string;
          blocker_id: string;
          blocked_id: string;
          reason: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          blocker_id: string;
          blocked_id: string;
          reason?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          blocker_id?: string;
          blocked_id?: string;
          reason?: string | null;
          created_at?: string;
        };
      };
      reports: {
        Row: {
          id: string;
          reporter_id: string;
          reported_id: string;
          reason: string;
          description: string | null;
          severity: string;
          reviewed_by: string | null;
          reviewed_at: string | null;
          action_taken: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          reporter_id: string;
          reported_id: string;
          reason: string;
          description?: string | null;
          severity?: string;
          reviewed_by?: string | null;
          reviewed_at?: string | null;
          action_taken?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          reporter_id?: string;
          reported_id?: string;
          reason?: string;
          description?: string | null;
          severity?: string;
          reviewed_by?: string | null;
          reviewed_at?: string | null;
          action_taken?: string | null;
          created_at?: string;
        };
      };
      emergency_incidents: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          location: string | null;
          timestamp: string;
          silent: boolean;
          resolved: boolean;
          resolved_at: string | null;
          resolved_by: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: string;
          location?: string | null;
          timestamp?: string;
          silent?: boolean;
          resolved?: boolean;
          resolved_at?: string | null;
          resolved_by?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: string;
          location?: string | null;
          timestamp?: string;
          silent?: boolean;
          resolved?: boolean;
          resolved_at?: string | null;
          resolved_by?: string | null;
        };
      };
      messages: {
        Row: {
          id: string;
          match_id: string;
          sender_id: string;
          content: string;
          message_type: string;
          expires_at: string | null;
          read_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          match_id: string;
          sender_id: string;
          content: string;
          message_type?: string;
          expires_at?: string | null;
          read_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          match_id?: string;
          sender_id?: string;
          content?: string;
          message_type?: string;
          expires_at?: string | null;
          read_at?: string | null;
          created_at?: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          title: string;
          content: string;
          urgent: boolean;
          read: boolean;
          metadata: string | null;
          created_at: string;
          read_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: string;
          title: string;
          content: string;
          urgent?: boolean;
          read?: boolean;
          metadata?: string | null;
          created_at?: string;
          read_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: string;
          title?: string;
          content?: string;
          urgent?: boolean;
          read?: boolean;
          metadata?: string | null;
          created_at?: string;
          read_at?: string | null;
        };
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          stripe_customer_id: string | null;
          stripe_subscription_id: string | null;
          stripe_price_id: string | null;
          tier: string;
          status: string;
          current_period_start: string | null;
          current_period_end: string | null;
          cancel_at_period_end: boolean;
          canceled_at: string | null;
          daily_swipes_used: number;
          weekly_boosts_used: number;
          monthly_video_calls_used: number;
          last_reset_date: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          stripe_price_id?: string | null;
          tier: string;
          status: string;
          current_period_start?: string | null;
          current_period_end?: string | null;
          cancel_at_period_end?: boolean;
          canceled_at?: string | null;
          daily_swipes_used?: number;
          weekly_boosts_used?: number;
          monthly_video_calls_used?: number;
          last_reset_date?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          stripe_price_id?: string | null;
          tier?: string;
          status?: string;
          current_period_start?: string | null;
          current_period_end?: string | null;
          cancel_at_period_end?: boolean;
          canceled_at?: string | null;
          daily_swipes_used?: number;
          weekly_boosts_used?: number;
          monthly_video_calls_used?: number;
          last_reset_date?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      verifications: {
        Row: {
          id: string;
          user_id: string;
          id_verified: boolean;
          photo_verified: boolean;
          background_check: boolean;
          verification_method: string | null;
          age_verification_photo: string | null;
          verified_at: string | null;
          expires_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          id_verified?: boolean;
          photo_verified?: boolean;
          background_check?: boolean;
          verification_method?: string | null;
          age_verification_photo?: string | null;
          verified_at?: string | null;
          expires_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          id_verified?: boolean;
          photo_verified?: boolean;
          background_check?: boolean;
          verification_method?: string | null;
          age_verification_photo?: string | null;
          verified_at?: string | null;
          expires_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      safety_profiles: {
        Row: {
          id: string;
          user_id: string;
          emergency_contacts: any | null;
          sti_status: any | null;
          safe_word: string | null;
          trusted_friends: string[];
          share_location_until: string | null;
          require_video_verify: boolean;
          public_meetup_only: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          emergency_contacts?: any | null;
          sti_status?: any | null;
          safe_word?: string | null;
          trusted_friends?: string[];
          share_location_until?: string | null;
          require_video_verify?: boolean;
          public_meetup_only?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          emergency_contacts?: any | null;
          sti_status?: any | null;
          safe_word?: string | null;
          trusted_friends?: string[];
          share_location_until?: string | null;
          require_video_verify?: boolean;
          public_meetup_only?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
}
