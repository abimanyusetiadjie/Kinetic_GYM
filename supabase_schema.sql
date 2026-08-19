-- ==============================================================================
-- KINETIC TECH GYM PLATFORM — SUPABASE PRODUCTION MIGRATION SCRIPT (V2 - 5 KILLER USPs)
-- PostgreSQL 16 + Supabase Auth + RLS + Realtime + Atomic RPC Functions
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. CUSTOM ENUMS
DO $$ BEGIN
    CREATE TYPE user_role_enum AS ENUM ('MEMBER', 'TRAINER', 'INSTRUCTOR', 'CLUB_STAFF', 'CLUB_MANAGER', 'SUPERADMIN');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE gender_enum AS ENUM ('MALE', 'FEMALE', 'OTHER');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE crowd_level_enum AS ENUM ('LOW', 'MODERATE', 'BUSY', 'OVERCROWDED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE facility_type_enum AS ENUM (
        'SAUNA', 'SHOWER_HOT_WATER', 'SMART_LOCKER', 'FREE_WEIGHT_ZONE', 
        'FUNCTIONAL_AREA', 'STUDIO_PILATES', 'CYCLING_STUDIO', 'PARKING_CAR', 'PARKING_BIKE', 'WATER_STATION'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE plan_tier_enum AS ENUM ('SINGLE_CLUB', 'ALL_CLUB', 'DAY_PASS', 'CORPORATE');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE membership_status_enum AS ENUM (
        'PENDING_PAYMENT', 'ACTIVE', 'FROZEN', 'PAST_DUE', 'SUSPENDED', 'EXPIRED', 'CANCELLED'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE intensity_level_enum AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'ALL_LEVELS');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE schedule_status_enum AS ENUM ('SCHEDULED', 'ONGOING', 'COMPLETED', 'CANCELLED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE booking_status_enum AS ENUM ('CONFIRMED', 'CANCELLED_ON_TIME', 'LATE_CANCELLED', 'ATTENDED', 'NO_SHOW');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE waitlist_status_enum AS ENUM ('QUEUED', 'PROMOTED', 'EXPIRED', 'CANCELLED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE gate_type_enum AS ENUM ('ENTRY_TRIPOD', 'EXIT_TRIPOD', 'FLAP_BARRIER');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE check_action_enum AS ENUM ('CHECK_IN', 'CHECK_OUT');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE check_status_enum AS ENUM ('GRANTED', 'DENIED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE order_status_enum AS ENUM ('PENDING', 'PAID', 'EXPIRED', 'FAILED', 'REFUNDED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE item_type_enum AS ENUM ('MEMBERSHIP_PLAN', 'PT_PACKAGE', 'DAY_PASS', 'FREEZE_FEE');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE buddy_pass_status_enum AS ENUM ('PENDING_CLAIM', 'ACTIVE_TODAY', 'USED', 'EXPIRED', 'CANCELLED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 3. TABLES DEFINITION

-- 3.1 USERS & PROFILES (Sync from auth.users)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    phone_number VARCHAR(20) UNIQUE,
    email VARCHAR(255) UNIQUE,
    full_name VARCHAR(150) NOT NULL,
    role user_role_enum DEFAULT 'MEMBER' NOT NULL,
    avatar_url TEXT,
    referral_code VARCHAR(20) UNIQUE NOT NULL,
    referred_by_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    gender gender_enum,
    birth_date DATE,
    height_cm NUMERIC(5,2),
    weight_kg NUMERIC(5,2),
    fitness_goal VARCHAR(100),
    emergency_contact_name VARCHAR(150),
    emergency_contact_phone VARCHAR(20),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- USP 4: USER STREAKS & BURN-TO-EARN GAMIFICATION
CREATE TABLE IF NOT EXISTS public.user_streaks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    current_streak_weeks INT DEFAULT 0 NOT NULL,
    longest_streak_weeks INT DEFAULT 0 NOT NULL,
    total_checkins_lifetime INT DEFAULT 0 NOT NULL,
    current_month_checkins INT DEFAULT 0 NOT NULL,
    reward_points_balance INT DEFAULT 0 NOT NULL,
    streak_discount_pct INT DEFAULT 0 NOT NULL, -- Misal 10% diskon renewal jika streak 12 minggu
    last_checkin_date DATE,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS public.user_health_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    recorded_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    weight_kg NUMERIC(5,2) NOT NULL,
    body_fat_pct NUMERIC(4,2),
    muscle_mass_kg NUMERIC(5,2),
    bmi NUMERIC(4,2),
    notes TEXT
);

-- 3.2 CLUBS & PREDICTIVE CROWD FORECASTS (USP 1)
CREATE TABLE IF NOT EXISTS public.clubs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,
    slug VARCHAR(150) UNIQUE NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    latitude NUMERIC(10, 7) NOT NULL,
    longitude NUMERIC(10, 7) NOT NULL,
    phone_number VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    max_capacity INT DEFAULT 150 NOT NULL,
    current_occupancy INT DEFAULT 0 NOT NULL,
    current_crowd_level crowd_level_enum DEFAULT 'LOW' NOT NULL,
    thumbnail_url TEXT,
    gallery_urls JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS public.club_facilities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    club_id UUID NOT NULL REFERENCES public.clubs(id) ON DELETE CASCADE,
    facility_type facility_type_enum NOT NULL,
    display_label VARCHAR(100) NOT NULL,
    icon_name VARCHAR(50),
    UNIQUE(club_id, facility_type)
);

CREATE TABLE IF NOT EXISTS public.club_operating_hours (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    club_id UUID NOT NULL REFERENCES public.clubs(id) ON DELETE CASCADE,
    day_of_week SMALLINT NOT NULL CHECK (day_of_week BETWEEN 1 AND 7),
    open_time TIME NOT NULL,
    close_time TIME NOT NULL,
    is_closed BOOLEAN DEFAULT FALSE NOT NULL,
    UNIQUE(club_id, day_of_week)
);

-- USP 1: PREDICTIVE HOURLY CROWD FORECAST ("Kapan Jam Terbaik Latihan?")
CREATE TABLE IF NOT EXISTS public.club_crowd_forecasts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    club_id UUID NOT NULL REFERENCES public.clubs(id) ON DELETE CASCADE,
    day_of_week SMALLINT NOT NULL CHECK (day_of_week BETWEEN 1 AND 7),
    hour_of_day SMALLINT NOT NULL CHECK (hour_of_day BETWEEN 0 AND 23),
    predicted_occupancy_pct INT DEFAULT 30 NOT NULL,
    predicted_crowd_level crowd_level_enum DEFAULT 'LOW' NOT NULL,
    is_best_time BOOLEAN DEFAULT FALSE NOT NULL,
    UNIQUE(club_id, day_of_week, hour_of_day)
);

CREATE TABLE IF NOT EXISTS public.club_crowd_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    club_id UUID NOT NULL REFERENCES public.clubs(id) ON DELETE CASCADE,
    recorded_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    occupancy_count INT NOT NULL,
    crowd_status crowd_level_enum NOT NULL
);

-- 3.3 MEMBERSHIP PLANS & SUBSCRIPTIONS
CREATE TABLE IF NOT EXISTS public.membership_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,
    slug VARCHAR(150) UNIQUE NOT NULL,
    tier plan_tier_enum NOT NULL,
    duration_months INT DEFAULT 1 NOT NULL,
    duration_days INT DEFAULT 30 NOT NULL,
    base_price_idr BIGINT NOT NULL,
    admin_fee_idr BIGINT DEFAULT 0 NOT NULL,
    free_freeze_days INT DEFAULT 0 NOT NULL,
    monthly_buddy_pass_quota INT DEFAULT 0 NOT NULL, -- Kuota pass teman bulanan
    is_featured BOOLEAN DEFAULT FALSE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    benefits JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS public.membership_plan_clubs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_id UUID NOT NULL REFERENCES public.membership_plans(id) ON DELETE CASCADE,
    club_id UUID NOT NULL REFERENCES public.clubs(id) ON DELETE CASCADE,
    UNIQUE(plan_id, club_id)
);

CREATE TABLE IF NOT EXISTS public.user_memberships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES public.membership_plans(id),
    home_club_id UUID REFERENCES public.clubs(id),
    status membership_status_enum DEFAULT 'PENDING_PAYMENT' NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    auto_renew BOOLEAN DEFAULT TRUE NOT NULL,
    strike_count SMALLINT DEFAULT 0 NOT NULL,
    booking_suspended_until TIMESTAMPTZ,
    total_freeze_days_used INT DEFAULT 0 NOT NULL,
    buddy_passes_used_this_month INT DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS public.membership_freezes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_membership_id UUID NOT NULL REFERENCES public.user_memberships(id) ON DELETE CASCADE,
    freeze_start_date DATE NOT NULL,
    freeze_end_date DATE NOT NULL,
    total_days INT NOT NULL,
    reason TEXT,
    fee_paid_idr BIGINT DEFAULT 0 NOT NULL,
    status VARCHAR(30) DEFAULT 'ACTIVE' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- USP 3: VIRAL WHATSAPP BUDDY PASS (1-Click Invite)
CREATE TABLE IF NOT EXISTS public.buddy_passes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    referrer_user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    club_id UUID NOT NULL REFERENCES public.clubs(id) ON DELETE CASCADE,
    share_token VARCHAR(64) UNIQUE NOT NULL,
    guest_name VARCHAR(150),
    guest_phone VARCHAR(20),
    guest_user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    valid_date DATE NOT NULL,
    dynamic_qr_secret VARCHAR(64),
    status buddy_pass_status_enum DEFAULT 'PENDING_CLAIM' NOT NULL,
    claimed_at TIMESTAMPTZ,
    used_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 3.4 CLASSES, INTERACTIVE STUDIO SPOT PICKER (USP 2) & INSTRUCTORS
CREATE TABLE IF NOT EXISTS public.class_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    badge_color VARCHAR(20) DEFAULT '#CAFF33'
);

CREATE TABLE IF NOT EXISTS public.fitness_classes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID NOT NULL REFERENCES public.class_categories(id),
    name VARCHAR(150) NOT NULL,
    slug VARCHAR(150) UNIQUE NOT NULL,
    description TEXT,
    intensity intensity_level_enum DEFAULT 'ALL_LEVELS' NOT NULL,
    duration_minutes INT DEFAULT 50 NOT NULL,
    estimated_calories_burn INT DEFAULT 450,
    cover_image_url TEXT,
    is_active BOOLEAN DEFAULT TRUE NOT NULL
);

CREATE TABLE IF NOT EXISTS public.instructors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    full_name VARCHAR(150) NOT NULL,
    bio TEXT,
    photo_url TEXT,
    specializations JSONB DEFAULT '[]'::jsonb,
    instagram_handle VARCHAR(100),
    rating_avg NUMERIC(3, 2) DEFAULT 5.0 NOT NULL,
    rating_count INT DEFAULT 0 NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL
);

-- USP 2: STUDIO LAYOUT CONFIGURATION
CREATE TABLE IF NOT EXISTS public.studio_layouts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    club_id UUID NOT NULL REFERENCES public.clubs(id) ON DELETE CASCADE,
    room_name VARCHAR(100) NOT NULL,
    total_spots INT DEFAULT 24 NOT NULL,
    -- Layout matrix JSON: rows, cols, spots: [{ id: 1, label: "Mat 01", row: 1, col: 1, type: "FRONT_ROW" }]
    layout_schema JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    UNIQUE(club_id, room_name)
);

CREATE TABLE IF NOT EXISTS public.class_schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fitness_class_id UUID NOT NULL REFERENCES public.fitness_classes(id),
    club_id UUID NOT NULL REFERENCES public.clubs(id) ON DELETE CASCADE,
    instructor_id UUID NOT NULL REFERENCES public.instructors(id),
    studio_layout_id UUID REFERENCES public.studio_layouts(id) ON DELETE SET NULL,
    studio_room_name VARCHAR(100) DEFAULT 'Main Studio',
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    max_capacity INT DEFAULT 30 NOT NULL,
    booked_count INT DEFAULT 0 NOT NULL,
    status schedule_status_enum DEFAULT 'SCHEDULED' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS public.class_bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    schedule_id UUID NOT NULL REFERENCES public.class_schedules(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    status booking_status_enum DEFAULT 'CONFIRMED' NOT NULL,
    seat_number INT,
    seat_label VARCHAR(30), -- Misal 'Matras A1' atau 'Sepeda #14' (USP 2)
    booked_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    cancelled_at TIMESTAMPTZ,
    checked_in_at TIMESTAMPTZ,
    strike_applied BOOLEAN DEFAULT FALSE NOT NULL,
    UNIQUE(schedule_id, user_id),
    UNIQUE(schedule_id, seat_number) -- Menjamin 1 kursi tidak terpesan 2 orang
);

CREATE TABLE IF NOT EXISTS public.class_waitlists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    schedule_id UUID NOT NULL REFERENCES public.class_schedules(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    position_number INT NOT NULL,
    status waitlist_status_enum DEFAULT 'QUEUED' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    promoted_at TIMESTAMPTZ,
    UNIQUE(schedule_id, user_id)
);

-- 3.5 PERSONAL TRAINER MARKETPLACE & VERIFIED REVIEWS (USP 5)
CREATE TABLE IF NOT EXISTS public.trainers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    home_club_id UUID NOT NULL REFERENCES public.clubs(id),
    title VARCHAR(100) DEFAULT 'Certified Elite Coach',
    bio TEXT,
    intro_video_url TEXT, -- Video intro singkat (USP 5)
    portfolio_images JSONB DEFAULT '[]'::jsonb, -- Transformasi klien terverifikasi
    certifications JSONB DEFAULT '[]'::jsonb,
    hourly_rate_idr BIGINT DEFAULT 250000 NOT NULL,
    rating_avg NUMERIC(3, 2) DEFAULT 5.0 NOT NULL,
    rating_count INT DEFAULT 0 NOT NULL,
    total_sessions_completed INT DEFAULT 0 NOT NULL,
    is_accepting_clients BOOLEAN DEFAULT TRUE NOT NULL
);

CREATE TABLE IF NOT EXISTS public.pt_packages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,
    total_sessions INT NOT NULL,
    validity_days INT NOT NULL,
    price_idr BIGINT NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE NOT NULL
);

CREATE TABLE IF NOT EXISTS public.user_pt_packages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    trainer_id UUID NOT NULL REFERENCES public.trainers(id),
    pt_package_id UUID NOT NULL REFERENCES public.pt_packages(id),
    total_sessions INT NOT NULL,
    remaining_sessions INT NOT NULL,
    status VARCHAR(30) DEFAULT 'ACTIVE' NOT NULL,
    start_date DATE NOT NULL,
    expiry_date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS public.pt_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_pt_package_id UUID NOT NULL REFERENCES public.user_pt_packages(id) ON DELETE CASCADE,
    trainer_id UUID NOT NULL REFERENCES public.trainers(id),
    user_id UUID NOT NULL REFERENCES public.users(id),
    club_id UUID NOT NULL REFERENCES public.clubs(id),
    scheduled_start TIMESTAMPTZ NOT NULL,
    scheduled_end TIMESTAMPTZ NOT NULL,
    status VARCHAR(30) DEFAULT 'SCHEDULED' NOT NULL,
    completion_otp_hash VARCHAR(255),
    verified_at TIMESTAMPTZ,
    notes TEXT,
    workout_summary JSONB
);

-- USP 5: VERIFIED MEMBER REVIEWS FOR PT
CREATE TABLE IF NOT EXISTS public.pt_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trainer_id UUID NOT NULL REFERENCES public.trainers(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    pt_session_id UUID REFERENCES public.pt_sessions(id) ON DELETE SET NULL,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    review_text TEXT,
    verified_sessions_count INT DEFAULT 1 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    UNIQUE(trainer_id, user_id)
);

-- 3.6 TURNSTILES & CHECK-IN LOGS
CREATE TABLE IF NOT EXISTS public.turnstiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    club_id UUID NOT NULL REFERENCES public.clubs(id) ON DELETE CASCADE,
    device_code VARCHAR(50) UNIQUE NOT NULL,
    device_name VARCHAR(100) NOT NULL,
    gate_type gate_type_enum DEFAULT 'ENTRY_TRIPOD' NOT NULL,
    ip_address INET,
    is_online BOOLEAN DEFAULT TRUE NOT NULL,
    last_heartbeat_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS public.checkin_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    club_id UUID NOT NULL REFERENCES public.clubs(id) ON DELETE CASCADE,
    turnstile_id UUID REFERENCES public.turnstiles(id) ON DELETE SET NULL,
    action check_action_enum NOT NULL,
    status check_status_enum NOT NULL,
    verification_method VARCHAR(30) DEFAULT 'DYNAMIC_QR' NOT NULL, -- DYNAMIC_QR, BUDDY_PASS, MANUAL_OVERRIDE
    failure_reason VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 3.7 BILLING, ORDERS & PAYMENTS
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    item_type item_type_enum NOT NULL,
    item_id UUID NOT NULL,
    gross_amount_idr BIGINT NOT NULL,
    discount_amount_idr BIGINT DEFAULT 0 NOT NULL,
    net_amount_idr BIGINT NOT NULL,
    status order_status_enum DEFAULT 'PENDING' NOT NULL,
    idempotency_key VARCHAR(100) UNIQUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    gateway_provider VARCHAR(50) NOT NULL,
    gateway_reference_id VARCHAR(100),
    payment_method VARCHAR(50) NOT NULL,
    amount_idr BIGINT NOT NULL,
    status VARCHAR(30) DEFAULT 'PENDING' NOT NULL,
    paid_at TIMESTAMPTZ,
    raw_response JSONB,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS public.promotions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    discount_type VARCHAR(20) NOT NULL,
    discount_value BIGINT NOT NULL,
    min_order_idr BIGINT DEFAULT 0 NOT NULL,
    max_discount_idr BIGINT,
    quota_total INT DEFAULT 100 NOT NULL,
    quota_used INT DEFAULT 0 NOT NULL,
    valid_from TIMESTAMPTZ NOT NULL,
    valid_until TIMESTAMPTZ NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL
);

-- 4. AUTOMATIC AUTH USER SYNC & STREAK INIT TRIGGER
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    v_ref_code VARCHAR(20);
BEGIN
    v_ref_code := 'KNT-' || UPPER(SUBSTRING(MD5(NEW.id::text || CURRENT_TIMESTAMP::text) FROM 1 FOR 6));

    INSERT INTO public.users (id, phone_number, email, full_name, role, referral_code)
    VALUES (
        NEW.id,
        NEW.phone,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'Member KINETIC'),
        COALESCE((NEW.raw_user_meta_data->>'role')::user_role_enum, 'MEMBER'),
        v_ref_code
    )
    ON CONFLICT (id) DO NOTHING;

    INSERT INTO public.user_profiles (user_id)
    VALUES (NEW.id)
    ON CONFLICT (user_id) DO NOTHING;

    INSERT INTO public.user_streaks (user_id)
    VALUES (NEW.id)
    ON CONFLICT (user_id) DO NOTHING;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 5. ATOMIC RPC FUNCTIONS (CONCURRENCY SAFE & SPOT PICKING)

-- 5.1 book_class_atomic (Dengan Pemilihan Spot/Matras Kursi USP 2)
CREATE OR REPLACE FUNCTION public.book_class_atomic(
    p_schedule_id UUID,
    p_seat_number INT DEFAULT NULL,
    p_seat_label VARCHAR DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_user_id UUID;
    v_schedule RECORD;
    v_active_membership RECORD;
    v_booking_id UUID;
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Unauthorized. Silakan login terlebih dahulu.' USING ERRCODE = '40100';
    END IF;

    -- Cek keanggotaan aktif
    SELECT * INTO v_active_membership FROM public.user_memberships 
    WHERE user_id = v_user_id AND status = 'ACTIVE' AND end_date >= CURRENT_DATE
    LIMIT 1;

    IF v_active_membership IS NULL THEN
        RETURN jsonb_build_object('success', false, 'errorCode', 'NO_ACTIVE_MEMBERSHIP', 'message', 'Keanggotaan aktif tidak ditemukan.');
    END IF;

    -- Cek suspensi penalti
    IF v_active_membership.booking_suspended_until IS NOT NULL AND v_active_membership.booking_suspended_until > CURRENT_TIMESTAMP THEN
        RETURN jsonb_build_object('success', false, 'errorCode', 'BOOKING_SUSPENDED', 'message', 'Akun sedang disanksi penalti pembatalan.');
    END IF;

    -- Lock baris schedule (FOR UPDATE)
    SELECT * INTO v_schedule FROM public.class_schedules 
    WHERE id = p_schedule_id AND status = 'SCHEDULED' 
    FOR UPDATE;

    IF v_schedule IS NULL THEN
        RETURN jsonb_build_object('success', false, 'errorCode', 'SCHEDULE_NOT_FOUND', 'message', 'Jadwal kelas tidak ditemukan.');
    END IF;

    -- Cek duplicate booking oleh user yang sama
    IF EXISTS (SELECT 1 FROM public.class_bookings WHERE schedule_id = p_schedule_id AND user_id = v_user_id AND status = 'CONFIRMED') THEN
        RETURN jsonb_build_object('success', false, 'errorCode', 'ALREADY_BOOKED', 'message', 'Anda sudah memesan kursi di kelas ini.');
    END IF;

    -- Cek ketersediaan spot/kursi spesifik jika dipilih
    IF p_seat_number IS NOT NULL THEN
        IF EXISTS (SELECT 1 FROM public.class_bookings WHERE schedule_id = p_schedule_id AND seat_number = p_seat_number AND status = 'CONFIRMED') THEN
            RETURN jsonb_build_object('success', false, 'errorCode', 'SEAT_TAKEN', 'message', 'Posisi kursi/matras ini baru saja dipilih member lain. Silakan pilih spot lain.');
        END IF;
    END IF;

    -- Cek total kuota
    IF v_schedule.booked_count >= v_schedule.max_capacity THEN
        RETURN jsonb_build_object('success', false, 'errorCode', 'CLASS_FULL', 'message', 'Kelas sudah penuh. Silakan masuk ke daftar tunggu (Waitlist).');
    END IF;

    -- Insert booking dan increment booked_count
    INSERT INTO public.class_bookings (schedule_id, user_id, seat_number, seat_label, status)
    VALUES (p_schedule_id, v_user_id, p_seat_number, COALESCE(p_seat_label, 'Spot ' || p_seat_number), 'CONFIRMED')
    RETURNING id INTO v_booking_id;

    UPDATE public.class_schedules 
    SET booked_count = booked_count + 1, updated_at = CURRENT_TIMESTAMP
    WHERE id = p_schedule_id;

    RETURN jsonb_build_object(
        'success', true, 
        'message', 'Booking berhasil terkonfirmasi.',
        'bookingId', v_booking_id,
        'scheduleId', p_schedule_id,
        'seatNumber', p_seat_number,
        'seatLabel', p_seat_label
    );
END;
$$;

-- 6. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.buddy_passes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checkin_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.club_crowd_forecasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.studio_layouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.membership_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trainers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pt_reviews ENABLE ROW LEVEL SECURITY;

-- Public Select Policies
DROP POLICY IF EXISTS "Public can view active clubs" ON public.clubs;
CREATE POLICY "Public can view active clubs" ON public.clubs FOR SELECT USING (is_active = TRUE);

DROP POLICY IF EXISTS "Public can view crowd forecasts" ON public.club_crowd_forecasts;
CREATE POLICY "Public can view crowd forecasts" ON public.club_crowd_forecasts FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "Public can view active membership plans" ON public.membership_plans;
CREATE POLICY "Public can view active membership plans" ON public.membership_plans FOR SELECT USING (is_active = TRUE);

DROP POLICY IF EXISTS "Public can view class schedules" ON public.class_schedules;
CREATE POLICY "Public can view class schedules" ON public.class_schedules FOR SELECT USING (status != 'CANCELLED');

DROP POLICY IF EXISTS "Public can view trainers" ON public.trainers;
CREATE POLICY "Public can view trainers" ON public.trainers FOR SELECT USING (is_accepting_clients = TRUE);

DROP POLICY IF EXISTS "Public can view pt reviews" ON public.pt_reviews;
CREATE POLICY "Public can view pt reviews" ON public.pt_reviews FOR SELECT USING (TRUE);

-- User Data Policies
DROP POLICY IF EXISTS "Users can view and update own profile" ON public.users;
CREATE POLICY "Users can view and update own profile" ON public.users FOR ALL USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can view own streaks" ON public.user_streaks;
CREATE POLICY "Users can view own streaks" ON public.user_streaks FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view own memberships" ON public.user_memberships;
CREATE POLICY "Users can view own memberships" ON public.user_memberships FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage own buddy passes" ON public.buddy_passes;
CREATE POLICY "Users can manage own buddy passes" ON public.buddy_passes FOR ALL USING (auth.uid() = referrer_user_id);

DROP POLICY IF EXISTS "Users can view and manage own class bookings" ON public.class_bookings;
CREATE POLICY "Users can view and manage own class bookings" ON public.class_bookings FOR ALL USING (auth.uid() = user_id);

-- 7. REALTIME REPLICATION ENABLEMENT
DO $$ BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.club_crowd_logs;
    ALTER PUBLICATION supabase_realtime ADD TABLE public.class_schedules;
    ALTER PUBLICATION supabase_realtime ADD TABLE public.checkin_logs;
    ALTER PUBLICATION supabase_realtime ADD TABLE public.user_streaks;
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 8. INITIAL SEED DATA
INSERT INTO public.class_categories (name, slug, description, badge_color)
VALUES 
    ('Cardio & HIIT', 'cardio-hiit', 'Latihan intensitas tinggi pembakar kalori', '#CAFF33'),
    ('Strength & Tone', 'strength-tone', 'Membangun kekuatan dan massa otot terarah', '#FF5E1E'),
    ('Dance & Rhythm', 'dance-rhythm', 'Zumba, Pound, dan tarian penuh energi', '#00E5FF'),
    ('Mind & Body', 'mind-body', 'Yoga, Pilates dan fleksibilitas tubuh', '#A855F7')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.membership_plans (name, slug, tier, duration_months, duration_days, base_price_idr, monthly_buddy_pass_quota, is_featured, benefits)
VALUES
    ('Starter Single Club', 'starter-single-1m', 'SINGLE_CLUB', 1, 30, 399000, 0, FALSE, '["Akses 1 Home Club", "Free Weights Zone", "Loker & Shower", "2 Kelas Gratis/Bln"]'::jsonb),
    ('Pro All Club', 'pro-all-3m', 'ALL_CLUB', 3, 90, 1272000, 1, TRUE, '["Akses 50+ Cabang", "Unlimited Studio Classes", "1x WhatsApp Buddy Pass/Bln", "Sauna & Shower", "Gratis 14 Hari Freeze", "Priority Booking"]'::jsonb),
    ('Elite All Club', 'elite-all-12m', 'ALL_CLUB', 12, 365, 5244000, 2, FALSE, '["Akses 50+ Cabang Seluruh Indonesia", "Unlimited Classes", "2x WhatsApp Buddy Pass/Bln", "4 Sesi PT/Bulan", "Towel & Private Locker"]'::jsonb)
ON CONFLICT (slug) DO NOTHING;
