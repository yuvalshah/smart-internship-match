-- Create profiles table for unified user management
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    company_name TEXT,
    email TEXT,
    avatar_url TEXT,
    user_type user_type NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can read own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Admins can read all profiles
CREATE POLICY "Admins can read all profiles" ON profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM admins
            WHERE admins.id = auth.uid()
        )
    );

-- Create indexes
CREATE INDEX idx_profiles_user_type ON profiles(user_type);
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_is_active ON profiles(is_active);

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
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update existing RLS policies to work with profiles table
-- Students can read internships
CREATE POLICY "Students can read internships" ON internships
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.user_type = 'student'
        )
    );

-- Companies can read their own internships
CREATE POLICY "Companies can read own internships" ON internships
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.user_type = 'company'
            AND profiles.id = internships.company_id
        )
    );

-- Students can read applications
CREATE POLICY "Students can read own applications" ON applications
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.user_type = 'student'
            AND profiles.id = applications.student_id
        )
    );

-- Companies can read applications for their internships
CREATE POLICY "Companies can read applications for their internships" ON applications
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.user_type = 'company'
            AND profiles.id IN (
                SELECT company_id FROM internships WHERE id = applications.internship_id
            )
        )
    );

-- Students can create applications
CREATE POLICY "Students can create applications" ON applications
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.user_type = 'student'
            AND profiles.id = applications.student_id
        )
    );

-- Students can update their own applications
CREATE POLICY "Students can update own applications" ON applications
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.user_type = 'student'
            AND profiles.id = applications.student_id
        )
    );

-- Companies can update applications for their internships
CREATE POLICY "Companies can update applications for their internships" ON applications
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.user_type = 'company'
            AND profiles.id IN (
                SELECT company_id FROM internships WHERE id = applications.internship_id
            )
        )
    );

-- Notifications policies
CREATE POLICY "Users can read own notifications" ON notifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON notifications
    FOR UPDATE USING (auth.uid() = user_id);

-- Admins can manage all notifications
CREATE POLICY "Admins can manage all notifications" ON notifications
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.user_type = 'admin'
        )
    );
