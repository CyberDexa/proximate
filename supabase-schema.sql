-- 🚀 ProxiMeet Database Schema
-- Run this in Supabase SQL Editor to create all tables

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE user_status AS ENUM ('active', 'suspended', 'locked');
CREATE TYPE verification_status AS ENUM ('pending', 'verified', 'rejected');
CREATE TYPE report_severity AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE emergency_type AS ENUM ('panic_button', 'safe_word', 'check_in_missed', 'manual_report');

-- Users table (core user data)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    email_verified TIMESTAMP,
    
    -- Required for age verification (18+ only)
    birth_date DATE NOT NULL,
    age_verified BOOLEAN DEFAULT FALSE,
    
    -- Profile verification
    is_verified BOOLEAN DEFAULT FALSE,
    image TEXT,
    
    -- Account status
    last_active TIMESTAMP,
    suspended BOOLEAN DEFAULT FALSE,
    suspended_reason TEXT,
    account_locked BOOLEAN DEFAULT FALSE,
    lock_reason TEXT,
    locked_at TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Profiles table (user preferences and settings)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    
    bio TEXT,
    location TEXT, -- Encrypted for privacy
    
    -- What user is looking for
    looking_for TEXT[] DEFAULT '{}',
    
    -- Adult-specific preferences
    kinks TEXT[] DEFAULT '{}',
    boundaries TEXT[] DEFAULT '{}',
    deal_breakers TEXT[] DEFAULT '{}',
    
    -- Privacy settings
    discreet_mode BOOLEAN DEFAULT FALSE,
    hide_from_contacts BOOLEAN DEFAULT FALSE,
    share_location BOOLEAN DEFAULT FALSE,
    
    -- Preference settings
    age_range_min INTEGER DEFAULT 18,
    age_range_max INTEGER DEFAULT 99,
    max_distance INTEGER DEFAULT 25,
    interested_in TEXT[] DEFAULT '{}',
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Verifications table
CREATE TABLE IF NOT EXISTS verifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    
    -- Verification levels
    id_verified BOOLEAN DEFAULT FALSE,
    photo_verified BOOLEAN DEFAULT FALSE,
    background_check BOOLEAN DEFAULT FALSE,
    
    -- Verification details
    verification_method TEXT,
    age_verification_photo TEXT,
    verified_at TIMESTAMP,
    expires_at TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Safety profiles table
CREATE TABLE IF NOT EXISTS safety_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    
    -- Emergency contacts (encrypted)
    emergency_contacts JSONB,
    
    -- Health status (optional, private)
    sti_status JSONB,
    
    -- Safety features
    safe_word TEXT,
    trusted_friends TEXT[] DEFAULT '{}',
    share_location_until TIMESTAMP,
    
    -- Safety preferences
    require_video_verify BOOLEAN DEFAULT FALSE,
    public_meetup_only BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Matches table
CREATE TABLE IF NOT EXISTS matches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_one_id UUID REFERENCES users(id) ON DELETE CASCADE,
    user_two_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    matched_at TIMESTAMP DEFAULT NOW(),
    last_interaction TIMESTAMP,
    
    -- Meetup planning
    meetup_planned BOOLEAN DEFAULT FALSE,
    meetup_time TIMESTAMP,
    consent_confirmed BOOLEAN DEFAULT FALSE,
    
    UNIQUE(user_one_id, user_two_id)
);

-- Likes table
CREATE TABLE IF NOT EXISTS likes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    giver_id UUID REFERENCES users(id) ON DELETE CASCADE,
    receiver_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    created_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(giver_id, receiver_id)
);

-- Blocks table (safety)
CREATE TABLE IF NOT EXISTS blocks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    blocker_id UUID REFERENCES users(id) ON DELETE CASCADE,
    blocked_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    reason TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(blocker_id, blocked_id)
);

-- Reports table (safety)
CREATE TABLE IF NOT EXISTS reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reporter_id UUID REFERENCES users(id) ON DELETE CASCADE,
    reported_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    reason TEXT NOT NULL,
    description TEXT,
    severity report_severity DEFAULT 'medium',
    
    -- Admin review
    reviewed_by TEXT,
    reviewed_at TIMESTAMP,
    action_taken TEXT,
    
    created_at TIMESTAMP DEFAULT NOW()
);

-- Emergency incidents table
CREATE TABLE IF NOT EXISTS emergency_incidents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    type emergency_type NOT NULL,
    location TEXT,
    timestamp TIMESTAMP DEFAULT NOW(),
    silent BOOLEAN DEFAULT FALSE,
    resolved BOOLEAN DEFAULT FALSE,
    resolved_at TIMESTAMP,
    resolved_by TEXT
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    match_id UUID REFERENCES matches(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    content TEXT NOT NULL,
    message_type TEXT DEFAULT 'text',
    
    -- Privacy features
    expires_at TIMESTAMP,
    read_at TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT NOW()
);

-- Subscriptions table (premium features)
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    
    -- Stripe integration
    stripe_customer_id TEXT UNIQUE,
    stripe_subscription_id TEXT UNIQUE,
    stripe_price_id TEXT,
    
    -- Subscription details
    tier TEXT NOT NULL,
    status TEXT NOT NULL,
    
    -- Billing
    current_period_start TIMESTAMP,
    current_period_end TIMESTAMP,
    cancel_at_period_end BOOLEAN DEFAULT FALSE,
    canceled_at TIMESTAMP,
    
    -- Features tracking
    daily_swipes_used INTEGER DEFAULT 0,
    weekly_boosts_used INTEGER DEFAULT 0,
    monthly_video_calls_used INTEGER DEFAULT 0,
    last_reset_date TIMESTAMP DEFAULT NOW(),
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_age_verified ON users(age_verified, last_active);
CREATE INDEX IF NOT EXISTS idx_users_verification_status ON users(is_verified, age_verified);

CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_matching ON profiles(max_distance, age_range_min, age_range_max);

CREATE INDEX IF NOT EXISTS idx_matches_users ON matches(user_one_id, user_two_id);
CREATE INDEX IF NOT EXISTS idx_matches_timing ON matches(matched_at, consent_confirmed);

CREATE INDEX IF NOT EXISTS idx_likes_giver ON likes(giver_id, created_at);
CREATE INDEX IF NOT EXISTS idx_likes_receiver ON likes(receiver_id, created_at);

CREATE INDEX IF NOT EXISTS idx_messages_match ON messages(match_id, created_at);
CREATE INDEX IF NOT EXISTS idx_emergency_incidents_user ON emergency_incidents(user_id, timestamp);

-- Insert success message
INSERT INTO users (email, name, birth_date, age_verified) 
VALUES ('test@proximeet.app', 'ProxiMeet Test', '1990-01-01', true)
ON CONFLICT (email) DO NOTHING;

SELECT 'ProxiMeet database schema created successfully! 🎉' as status;
