-- Add student profile fields to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS date_of_birth DATE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS state TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS district TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS pincode TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS current_education TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS university TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS course TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS graduation_year TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS cgpa TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS social_category TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS family_income TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS participation_type TEXT DEFAULT 'first-time';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS skills TEXT[] DEFAULT '{}';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS preferred_locations TEXT[] DEFAULT '{}';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS stipend_expectation TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS available_duration TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS additional_info TEXT;

-- Add internship fields to internships table
ALTER TABLE internships ADD COLUMN IF NOT EXISTS state TEXT;
ALTER TABLE internships ADD COLUMN IF NOT EXISTS district TEXT;
ALTER TABLE internships ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE internships ADD COLUMN IF NOT EXISTS requirements TEXT[];
ALTER TABLE internships ADD COLUMN IF NOT EXISTS stipend TEXT;
ALTER TABLE internships ADD COLUMN IF NOT EXISTS duration TEXT;
ALTER TABLE internships ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'on-site';
ALTER TABLE internships ADD COLUMN IF NOT EXISTS department TEXT;
ALTER TABLE internships ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'other';
ALTER TABLE internships ADD COLUMN IF NOT EXISTS company_size TEXT DEFAULT 'mid-size';
ALTER TABLE internships ADD COLUMN IF NOT EXISTS skills TEXT[] DEFAULT '{}';

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_state ON profiles(state);
CREATE INDEX IF NOT EXISTS idx_profiles_city ON profiles(city);
CREATE INDEX IF NOT EXISTS idx_profiles_participation_type ON profiles(participation_type);
CREATE INDEX IF NOT EXISTS idx_internships_state ON internships(state);
CREATE INDEX IF NOT EXISTS idx_internships_city ON internships(city);
CREATE INDEX IF NOT EXISTS idx_internships_category ON internships(category);
CREATE INDEX IF NOT EXISTS idx_internships_type ON internships(type);
