export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type UserRole = 'MEMBER' | 'TRAINER' | 'INSTRUCTOR' | 'CLUB_STAFF' | 'CLUB_MANAGER' | 'SUPERADMIN'
export type Gender = 'MALE' | 'FEMALE' | 'OTHER'
export type CrowdLevel = 'LOW' | 'MODERATE' | 'BUSY' | 'OVERCROWDED'
export type FacilityType = 
  | 'SAUNA' 
  | 'SHOWER_HOT_WATER' 
  | 'SMART_LOCKER' 
  | 'FREE_WEIGHT_ZONE' 
  | 'FUNCTIONAL_AREA' 
  | 'STUDIO_PILATES' 
  | 'CYCLING_STUDIO' 
  | 'PARKING_CAR' 
  | 'PARKING_BIKE' 
  | 'WATER_STATION'
export type PlanTier = 'SINGLE_CLUB' | 'ALL_CLUB' | 'DAY_PASS' | 'CORPORATE'
export type MembershipStatus = 
  | 'PENDING_PAYMENT' 
  | 'ACTIVE' 
  | 'FROZEN' 
  | 'PAST_DUE' 
  | 'SUSPENDED' 
  | 'EXPIRED' 
  | 'CANCELLED'
export type IntensityLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'ALL_LEVELS'
export type ScheduleStatus = 'SCHEDULED' | 'ONGOING' | 'COMPLETED' | 'CANCELLED'
export type BookingStatus = 'CONFIRMED' | 'CANCELLED_ON_TIME' | 'LATE_CANCELLED' | 'ATTENDED' | 'NO_SHOW'
export type WaitlistStatus = 'QUEUED' | 'PROMOTED' | 'EXPIRED' | 'CANCELLED'
export type GateType = 'ENTRY_TRIPOD' | 'EXIT_TRIPOD' | 'FLAP_BARRIER'
export type CheckAction = 'CHECK_IN' | 'CHECK_OUT'
export type CheckStatus = 'GRANTED' | 'DENIED'
export type OrderStatus = 'PENDING' | 'PAID' | 'EXPIRED' | 'FAILED' | 'REFUNDED'
export type ItemType = 'MEMBERSHIP_PLAN' | 'PT_PACKAGE' | 'DAY_PASS' | 'FREEZE_FEE'
export type BuddyPassStatus = 'PENDING_CLAIM' | 'ACTIVE_TODAY' | 'USED' | 'EXPIRED' | 'CANCELLED'

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          phone_number: string | null
          email: string | null
          full_name: string
          role: UserRole
          avatar_url: string | null
          referral_code: string
          referred_by_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          phone_number?: string | null
          email?: string | null
          full_name: string
          role?: UserRole
          avatar_url?: string | null
          referral_code: string
          referred_by_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          phone_number?: string | null
          email?: string | null
          full_name?: string
          role?: UserRole
          avatar_url?: string | null
          referral_code?: string
          referred_by_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_streaks: {
        Row: {
          id: string
          user_id: string
          current_streak_weeks: number
          longest_streak_weeks: number
          total_checkins_lifetime: number
          current_month_checkins: number
          reward_points_balance: number
          streak_discount_pct: number
          last_checkin_date: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          current_streak_weeks?: number
          longest_streak_weeks?: number
          total_checkins_lifetime?: number
          current_month_checkins?: number
          reward_points_balance?: number
          streak_discount_pct?: number
          last_checkin_date?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          current_streak_weeks?: number
          longest_streak_weeks?: number
          total_checkins_lifetime?: number
          current_month_checkins?: number
          reward_points_balance?: number
          streak_discount_pct?: number
          last_checkin_date?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      clubs: {
        Row: {
          id: string
          name: string
          slug: string
          address: string
          city: string
          latitude: number
          longitude: number
          phone_number: string | null
          is_active: boolean
          max_capacity: number
          current_occupancy: number
          current_crowd_level: CrowdLevel
          thumbnail_url: string | null
          gallery_urls: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          address: string
          city: string
          latitude: number
          longitude: number
          phone_number?: string | null
          is_active?: boolean
          max_capacity?: number
          current_occupancy?: number
          current_crowd_level?: CrowdLevel
          thumbnail_url?: string | null
          gallery_urls?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          address?: string
          city?: string
          latitude?: number
          longitude?: number
          phone_number?: string | null
          is_active?: boolean
          max_capacity?: number
          current_occupancy?: number
          current_crowd_level?: CrowdLevel
          thumbnail_url?: string | null
          gallery_urls?: Json
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          id: string
          order_number: string
          user_id: string
          item_type: ItemType
          item_id: string
          gross_amount_idr: number
          discount_amount_idr: number
          net_amount_idr: number
          status: OrderStatus
          idempotency_key: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_number: string
          user_id: string
          item_type: ItemType
          item_id: string
          gross_amount_idr: number
          discount_amount_idr?: number
          net_amount_idr: number
          status?: OrderStatus
          idempotency_key?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_number?: string
          user_id?: string
          item_type?: ItemType
          item_id?: string
          gross_amount_idr?: number
          discount_amount_idr?: number
          net_amount_idr?: number
          status?: OrderStatus
          idempotency_key?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          id: string
          order_id: string
          gateway_provider: string
          gateway_reference_id: string | null
          payment_method: string
          amount_idr: number
          status: string
          paid_at: string | null
          raw_response: Json
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          gateway_provider: string
          gateway_reference_id?: string | null
          payment_method: string
          amount_idr: number
          status?: string
          paid_at?: string | null
          raw_response?: Json
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          gateway_provider?: string
          gateway_reference_id?: string | null
          payment_method?: string
          amount_idr?: number
          status?: string
          paid_at?: string | null
          raw_response?: Json
          created_at?: string
        }
        Relationships: []
      }
      buddy_passes: {
        Row: {
          id: string
          referrer_user_id: string
          club_id: string
          share_token: string
          guest_name: string | null
          guest_phone: string | null
          valid_date: string
          status: BuddyPassStatus
          claimed_at: string | null
          used_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          referrer_user_id: string
          club_id: string
          share_token: string
          guest_name?: string | null
          guest_phone?: string | null
          valid_date: string
          status?: BuddyPassStatus
          claimed_at?: string | null
          used_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          referrer_user_id?: string
          club_id?: string
          share_token?: string
          guest_name?: string | null
          guest_phone?: string | null
          valid_date?: string
          status?: BuddyPassStatus
          claimed_at?: string | null
          used_at?: string | null
          created_at?: string
        }
        Relationships: []
      }
      class_schedules: {
        Row: {
          id: string
          fitness_class_id: string
          club_id: string
          instructor_id: string
          studio_layout_id: string | null
          studio_room_name: string
          start_time: string
          end_time: string
          max_capacity: number
          booked_count: number
          status: ScheduleStatus
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          fitness_class_id: string
          club_id: string
          instructor_id: string
          studio_layout_id?: string | null
          studio_room_name?: string
          start_time: string
          end_time: string
          max_capacity?: number
          booked_count?: number
          status?: ScheduleStatus
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          fitness_class_id?: string
          club_id?: string
          instructor_id?: string
          studio_layout_id?: string | null
          studio_room_name?: string
          start_time?: string
          end_time?: string
          max_capacity?: number
          booked_count?: number
          status?: ScheduleStatus
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      class_bookings: {
        Row: {
          id: string
          schedule_id: string
          user_id: string
          status: BookingStatus
          seat_number: number | null
          seat_label: string | null
          booked_at: string
          cancelled_at: string | null
          checked_in_at: string | null
          strike_applied: boolean
        }
        Insert: {
          id?: string
          schedule_id: string
          user_id: string
          status?: BookingStatus
          seat_number?: number | null
          seat_label?: string | null
          booked_at?: string
          cancelled_at?: string | null
          checked_in_at?: string | null
          strike_applied?: boolean
        }
        Update: {
          id?: string
          schedule_id?: string
          user_id?: string
          status?: BookingStatus
          seat_number?: number | null
          seat_label?: string | null
          booked_at?: string
          cancelled_at?: string | null
          checked_in_at?: string | null
          strike_applied?: boolean
        }
        Relationships: []
      }
      trainers: {
        Row: {
          id: string
          user_id: string
          home_club_id: string
          title: string
          bio: string | null
          intro_video_url: string | null
          portfolio_images: Json
          certifications: Json
          hourly_rate_idr: number
          rating_avg: number
          rating_count: number
          total_sessions_completed: number
          is_accepting_clients: boolean
        }
        Insert: {
          id?: string
          user_id: string
          home_club_id: string
          title?: string
          bio?: string | null
          intro_video_url?: string | null
          portfolio_images?: Json
          certifications?: Json
          hourly_rate_idr?: number
          rating_avg?: number
          rating_count?: number
          total_sessions_completed?: number
          is_accepting_clients?: boolean
        }
        Update: {
          id?: string
          user_id?: string
          home_club_id?: string
          title?: string
          bio?: string | null
          intro_video_url?: string | null
          portfolio_images?: Json
          certifications?: Json
          hourly_rate_idr?: number
          rating_avg?: number
          rating_count?: number
          total_sessions_completed?: number
          is_accepting_clients?: boolean
        }
        Relationships: []
      }
      pt_reviews: {
        Row: {
          id: string
          trainer_id: string
          user_id: string
          pt_session_id: string | null
          rating: number
          review_text: string | null
          verified_sessions_count: number
          created_at: string
        }
        Insert: {
          id?: string
          trainer_id: string
          user_id: string
          pt_session_id?: string | null
          rating: number
          review_text?: string | null
          verified_sessions_count?: number
          created_at?: string
        }
        Update: {
          id?: string
          trainer_id?: string
          user_id?: string
          pt_session_id?: string | null
          rating?: number
          review_text?: string | null
          verified_sessions_count?: number
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      book_class_atomic: {
        Args: {
          p_schedule_id: string
          p_seat_number?: number | null
          p_seat_label?: string | null
        }
        Returns: Json
      }
    }
    Enums: {
      user_role_enum: UserRole
      gender_enum: Gender
      crowd_level_enum: CrowdLevel
      facility_type_enum: FacilityType
      plan_tier_enum: PlanTier
      membership_status_enum: MembershipStatus
      intensity_level_enum: IntensityLevel
      schedule_status_enum: ScheduleStatus
      booking_status_enum: BookingStatus
      waitlist_status_enum: WaitlistStatus
      gate_type_enum: GateType
      check_action_enum: CheckAction
      check_status_enum: CheckStatus
      order_status_enum: OrderStatus
      item_type_enum: ItemType
      buddy_pass_status_enum: BuddyPassStatus
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
