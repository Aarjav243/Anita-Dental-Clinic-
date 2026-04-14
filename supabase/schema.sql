-- ============================================================
-- Dr. Anita Mankottill Dental Clinic - Database Schema
-- Paste this entire file into Supabase SQL Editor and run it
-- ============================================================

-- 1. SERVICES
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL,
  buffer_minutes INTEGER NOT NULL DEFAULT 5,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. BREAK TIMES (blocks within sessions)
CREATE TABLE IF NOT EXISTS break_times (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label TEXT NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL
);

-- 3. AVAILABILITY OVERRIDES (blocked dates)
CREATE TABLE IF NOT EXISTS availability_overrides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL UNIQUE,
  is_available BOOLEAN DEFAULT false,
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. ASSISTANT USERS (whitelisted Gmail accounts)
CREATE TABLE IF NOT EXISTS assistant_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. APPOINTMENTS
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_name TEXT NOT NULL,
  patient_phone TEXT NOT NULL,
  service_id UUID NOT NULL REFERENCES services(id),
  slot_start TIMESTAMPTZ NOT NULL,
  slot_end TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'rejected', 'cancelled', 'completed')),
  rejection_reason TEXT,
  notes TEXT,
  cancel_token UUID DEFAULT gen_random_uuid(),
  reschedule_token UUID DEFAULT gen_random_uuid(),
  reminder_sent BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- SEED: Services
-- ============================================================
INSERT INTO services (name, duration_minutes, buffer_minutes, description) VALUES
  ('General Consultation / Checkup', 15, 5, 'Routine dental examination and consultation'),
  ('Dental X-Ray', 15, 5, 'Digital dental X-ray imaging'),
  ('Teeth Cleaning (Scaling & Polishing)', 60, 10, 'Professional cleaning to remove plaque and tartar'),
  ('Tooth Filling (Composite)', 45, 10, 'Tooth-coloured composite resin filling'),
  ('Tooth Extraction – Simple', 30, 10, 'Simple removal of a tooth'),
  ('Tooth Extraction – Surgical', 60, 15, 'Surgical removal of impacted or difficult tooth'),
  ('Root Canal Treatment', 90, 15, 'Complete root canal therapy'),
  ('Dental Crown Fitting', 60, 10, 'Custom crown placement and fitting'),
  ('Teeth Whitening', 90, 10, 'Professional in-clinic teeth whitening'),
  ('Braces Consultation', 30, 5, 'Orthodontic assessment and treatment planning'),
  ('Braces Adjustment', 30, 5, 'Routine braces tightening and adjustment'),
  ('Dental Implant Consultation', 30, 5, 'Implant assessment and planning'),
  ('Dental Implant Surgery', 120, 20, 'Full dental implant surgical procedure'),
  ('Paediatric Dental Checkup', 20, 5, 'Child-friendly dental examination'),
  ('Emergency Dental Care', 30, 10, 'Urgent dental treatment for pain or injury'),
  ('Gum Treatment (Deep Cleaning)', 90, 15, 'Periodontal deep cleaning and scaling'),
  ('Denture Fitting', 60, 10, 'Custom denture fitting and adjustment');

-- ============================================================
-- SEED: Break Times
-- ============================================================
INSERT INTO break_times (label, start_time, end_time) VALUES
  ('Lunch Break', '13:00', '14:00');

-- ============================================================
-- SEED: Assistant Users (whitelisted Gmail)
-- ============================================================
INSERT INTO assistant_users (email, name) VALUES
  ('aarja2434@gmail.com', 'Assistant');

-- ============================================================
-- Row Level Security
-- ============================================================
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE break_times ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability_overrides ENABLE ROW LEVEL SECURITY;
ALTER TABLE assistant_users ENABLE ROW LEVEL SECURITY;

-- Services: anyone can read
CREATE POLICY "Services are publicly readable" ON services FOR SELECT USING (true);

-- Appointments: public can insert (book), service role handles the rest
CREATE POLICY "Anyone can create appointment" ON appointments FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can read own appointment by token" ON appointments FOR SELECT USING (true);

-- Break times: publicly readable
CREATE POLICY "Break times are publicly readable" ON break_times FOR SELECT USING (true);

-- Availability overrides: publicly readable
CREATE POLICY "Overrides are publicly readable" ON availability_overrides FOR SELECT USING (true);
