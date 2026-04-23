-- 🛠️ SURVEY DATABASE FIX SCRIPT
-- Copy and run this in your Supabase SQL Editor

-- 1. Ensure columns exist for referral system
ALTER TABLE survey_responses ADD COLUMN IF NOT EXISTS referred_by uuid;
ALTER TABLE survey_responses ADD COLUMN IF NOT EXISTS referral_count int DEFAULT 0;

-- 2. Fix RLS (Row Level Security) Policies
DROP POLICY IF EXISTS "Allow anonymous selects" ON survey_responses;
CREATE POLICY "Allow anonymous selects" ON survey_responses FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow anonymous updates" ON survey_responses;
CREATE POLICY "Allow anonymous updates" ON survey_responses FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow anonymous inserts" ON survey_responses;
CREATE POLICY "Allow anonymous inserts" ON survey_responses FOR INSERT WITH CHECK (true);

-- 3. Blocked IPs System
CREATE TABLE IF NOT EXISTS blocked_ips (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  ip_address text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE blocked_ips ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow anonymous select blocked_ips" ON blocked_ips;
CREATE POLICY "Allow anonymous select blocked_ips" ON blocked_ips FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow anonymous insert blocked_ips" ON blocked_ips;
CREATE POLICY "Allow anonymous insert blocked_ips" ON blocked_ips FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anonymous delete blocked_ips" ON blocked_ips;
CREATE POLICY "Allow anonymous delete blocked_ips" ON blocked_ips FOR DELETE USING (true);

-- 4. Enable Realtime for survey_responses
-- This allows the admin panel to update automatically without refresh
ALTER PUBLICATION supabase_realtime ADD TABLE survey_responses;