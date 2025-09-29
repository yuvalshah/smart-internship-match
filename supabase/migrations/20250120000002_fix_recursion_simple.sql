-- Simple fix for infinite recursion - disable RLS temporarily and create basic policies

-- First, disable RLS on all tables to stop the recursion
ALTER TABLE students DISABLE ROW LEVEL SECURITY;
ALTER TABLE companies DISABLE ROW LEVEL SECURITY;
ALTER TABLE internships DISABLE ROW LEVEL SECURITY;
ALTER TABLE applications DISABLE ROW LEVEL SECURITY;
ALTER TABLE allocations DISABLE ROW LEVEL SECURITY;
ALTER TABLE feedback DISABLE ROW LEVEL SECURITY;
ALTER TABLE admins DISABLE ROW LEVEL SECURITY;
ALTER TABLE notifications DISABLE ROW LEVEL SECURITY;
ALTER TABLE chatbot_conversations DISABLE ROW LEVEL SECURITY;
ALTER TABLE skills_catalog DISABLE ROW LEVEL SECURITY;
ALTER TABLE email_templates DISABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings DISABLE ROW LEVEL SECURITY;

-- Create profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    company_name TEXT,
    email TEXT,
    avatar_url TEXT,
    user_type user_type NOT NULL DEFAULT 'student',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    resume_url TEXT,
    linkedin_url TEXT,
    github_url TEXT
);

-- Enable RLS on profiles only
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Simple policies for profiles
CREATE POLICY "Users can read own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, email, user_type)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'user_type', 'student')::user_type
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Re-enable RLS on other tables with simple policies
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE internships ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Simple policies for students
CREATE POLICY "Students can read own data" ON students
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Students can update own data" ON students
    FOR UPDATE USING (auth.uid() = id);

-- Simple policies for companies
CREATE POLICY "Companies can read own data" ON companies
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Companies can update own data" ON companies
    FOR UPDATE USING (auth.uid() = id);

-- Simple policies for internships
CREATE POLICY "Anyone can read internships" ON internships
    FOR SELECT USING (true);

CREATE POLICY "Companies can manage internships" ON internships
    FOR ALL USING (auth.uid() = company_id);

-- Simple policies for applications
CREATE POLICY "Students can read own applications" ON applications
    FOR SELECT USING (auth.uid() = student_id);

CREATE POLICY "Students can create applications" ON applications
    FOR INSERT WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Students can update own applications" ON applications
    FOR UPDATE USING (auth.uid() = student_id);

CREATE POLICY "Companies can read applications for their internships" ON applications
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM internships 
            WHERE internships.id = applications.internship_id 
            AND internships.company_id = auth.uid()
        )
    );

-- Simple policies for other tables
CREATE POLICY "Anyone can read notifications" ON notifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Anyone can insert notifications" ON notifications
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update own notifications" ON notifications
    FOR UPDATE USING (auth.uid() = user_id);
