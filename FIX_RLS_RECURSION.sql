-- FINAL FIX FOR RLS INFINITE RECURSION ERROR
-- Copy this entire script and run it in your Supabase Dashboard SQL Editor

-- First, disable RLS on all tables temporarily
ALTER TABLE IF EXISTS profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS students DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS companies DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS internships DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS applications DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS notifications DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies to start fresh
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Students can read own data" ON students;
DROP POLICY IF EXISTS "Students can update own data" ON students;
DROP POLICY IF EXISTS "Companies can read own data" ON companies;
DROP POLICY IF EXISTS "Companies can update own data" ON companies;
DROP POLICY IF EXISTS "Anyone can read internships" ON internships;
DROP POLICY IF EXISTS "Companies can manage internships" ON internships;
DROP POLICY IF EXISTS "Students can read own applications" ON applications;
DROP POLICY IF EXISTS "Students can create applications" ON applications;
DROP POLICY IF EXISTS "Students can update own applications" ON applications;
DROP POLICY IF EXISTS "Companies can read applications for their internships" ON applications;
DROP POLICY IF EXISTS "Anyone can read notifications" ON notifications;
DROP POLICY IF EXISTS "Anyone can insert notifications" ON notifications;
DROP POLICY IF EXISTS "Anyone can update own notifications" ON notifications;

-- Create profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    company_name TEXT,
    email TEXT,
    avatar_url TEXT,
    user_type TEXT DEFAULT 'student',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    resume_url TEXT,
    linkedin_url TEXT,
    github_url TEXT
);

-- Create simple, non-recursive RLS policies
-- Enable RLS on profiles with simple policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select_policy" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "profiles_insert_policy" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_policy" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- Enable RLS on other tables with simple policies
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE internships ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Students table policies
CREATE POLICY "students_select_policy" ON students
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "students_insert_policy" ON students
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "students_update_policy" ON students
    FOR UPDATE USING (auth.uid() = id);

-- Companies table policies
CREATE POLICY "companies_select_policy" ON companies
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "companies_insert_policy" ON companies
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "companies_update_policy" ON companies
    FOR UPDATE USING (auth.uid() = id);

-- Internships table policies
CREATE POLICY "internships_select_policy" ON internships
    FOR SELECT USING (true);

CREATE POLICY "internships_insert_policy" ON internships
    FOR INSERT WITH CHECK (auth.uid() = company_id);

CREATE POLICY "internships_update_policy" ON internships
    FOR UPDATE USING (auth.uid() = company_id);

CREATE POLICY "internships_delete_policy" ON internships
    FOR DELETE USING (auth.uid() = company_id);

-- Applications table policies
CREATE POLICY "applications_select_policy" ON applications
    FOR SELECT USING (auth.uid() = student_id);

CREATE POLICY "applications_insert_policy" ON applications
    FOR INSERT WITH CHECK (auth.uid() = student_id);

CREATE POLICY "applications_update_policy" ON applications
    FOR UPDATE USING (auth.uid() = student_id);

-- Notifications table policies
CREATE POLICY "notifications_select_policy" ON notifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "notifications_insert_policy" ON notifications
    FOR INSERT WITH CHECK (true);

CREATE POLICY "notifications_update_policy" ON notifications
    FOR UPDATE USING (auth.uid() = user_id);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, email, user_type)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'user_type', 'student')
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();







-- Fixed migration - drop existing policies first, then create new ones

-- First, drop all existing policies to avoid conflicts
-- DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
-- DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
-- DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
-- DROP POLICY IF EXISTS "Students can read own data" ON students;
-- DROP POLICY IF EXISTS "Students can update own data" ON students;
-- DROP POLICY IF EXISTS "Companies can read own data" ON companies;
-- DROP POLICY IF EXISTS "Companies can update own data" ON companies;
-- DROP POLICY IF EXISTS "Anyone can read internships" ON internships;
-- DROP POLICY IF EXISTS "Companies can manage internships" ON internships;
-- DROP POLICY IF EXISTS "Students can read own applications" ON applications;
-- DROP POLICY IF EXISTS "Students can create applications" ON applications;
-- DROP POLICY IF EXISTS "Students can update own applications" ON applications;
-- DROP POLICY IF EXISTS "Companies can read applications for their internships" ON applications;
-- DROP POLICY IF EXISTS "Anyone can read notifications" ON notifications;
-- DROP POLICY IF EXISTS "Anyone can insert notifications" ON notifications;
-- DROP POLICY IF EXISTS "Anyone can update own notifications" ON notifications;

-- -- Disable RLS on all tables to stop the recursion
-- ALTER TABLE students DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE companies DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE internships DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE applications DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE allocations DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE feedback DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE admins DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE notifications DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE chatbot_conversations DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE skills_catalog DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE email_templates DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE audit_logs DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE system_settings DISABLE ROW LEVEL SECURITY;

-- -- Create profiles table if it doesn't exist
-- CREATE TABLE IF NOT EXISTS profiles (
--     id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
--     full_name TEXT,
--     company_name TEXT,
--     email TEXT,
--     avatar_url TEXT,
--     user_type user_type NOT NULL DEFAULT 'student',
--     is_active BOOLEAN DEFAULT TRUE,
--     created_at TIMESTAMPTZ DEFAULT NOW(),
--     updated_at TIMESTAMPTZ DEFAULT NOW(),
--     resume_url TEXT,
--     linkedin_url TEXT,
--     github_url TEXT
-- );

-- -- Enable RLS on profiles only
-- ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- -- Create simple policies for profiles
-- CREATE POLICY "Users can read own profile" ON profiles
--     FOR SELECT USING (auth.uid() = id);

-- CREATE POLICY "Users can update own profile" ON profiles
--     FOR UPDATE USING (auth.uid() = id);

-- CREATE POLICY "Users can insert own profile" ON profiles
--     FOR INSERT WITH CHECK (auth.uid() = id);

-- -- Create function to handle new user signup
-- CREATE OR REPLACE FUNCTION public.handle_new_user()
-- RETURNS TRIGGER AS $$
-- BEGIN
--     INSERT INTO public.profiles (id, full_name, email, user_type)
--     VALUES (
--         NEW.id,
--         COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
--         NEW.email,
--         COALESCE(NEW.raw_user_meta_data->>'user_type', 'student')::user_type
--     );
--     RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql SECURITY DEFINER;

-- -- Create trigger for new user signup
-- DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
-- CREATE TRIGGER on_auth_user_created
--     AFTER INSERT ON auth.users
--     FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- -- Re-enable RLS on other tables with simple policies
-- ALTER TABLE students ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE internships ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- -- Create simple policies for students
-- CREATE POLICY "Students can read own data" ON students
--     FOR SELECT USING (auth.uid() = id);

-- CREATE POLICY "Students can update own data" ON students
--     FOR UPDATE USING (auth.uid() = id);

-- -- Create simple policies for companies
-- CREATE POLICY "Companies can read own data" ON companies
--     FOR SELECT USING (auth.uid() = id);

-- CREATE POLICY "Companies can update own data" ON companies
--     FOR UPDATE USING (auth.uid() = id);

-- -- Create simple policies for internships
-- CREATE POLICY "Anyone can read internships" ON internships
--     FOR SELECT USING (true);

-- CREATE POLICY "Companies can manage internships" ON internships
--     FOR ALL USING (auth.uid() = company_id);

-- -- Create simple policies for applications
-- CREATE POLICY "Students can read own applications" ON applications
--     FOR SELECT USING (auth.uid() = student_id);

-- CREATE POLICY "Students can create applications" ON applications
--     FOR INSERT WITH CHECK (auth.uid() = student_id);

-- CREATE POLICY "Students can update own applications" ON applications
--     FOR UPDATE USING (auth.uid() = student_id);

-- CREATE POLICY "Companies can read applications for their internships" ON applications
--     FOR SELECT USING (
--         EXISTS (
--             SELECT 1 FROM internships 
--             WHERE internships.id = applications.internship_id 
--             AND internships.company_id = auth.uid()
--         )
--     );

-- -- Create simple policies for other tables
-- CREATE POLICY "Anyone can read notifications" ON notifications
--     FOR SELECT USING (auth.uid() = user_id);

-- CREATE POLICY "Anyone can insert notifications" ON notifications
--     FOR INSERT WITH CHECK (true);

-- CREATE POLICY "Anyone can update own notifications" ON notifications
--     FOR UPDATE USING (auth.uid() = user_id);