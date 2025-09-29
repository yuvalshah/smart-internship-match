-- Fix infinite recursion in profiles table policies
-- Drop all existing problematic policies first
DROP POLICY IF EXISTS "Admins can read all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can manage all profiles" ON profiles;

-- Create simple, non-recursive policies for profiles
CREATE POLICY "Users can read own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Create a simple admin check function to avoid recursion
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() 
        AND user_type = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Use the function for admin policies to avoid recursion
CREATE POLICY "Admins can read all profiles" ON profiles
    FOR SELECT USING (is_admin());

CREATE POLICY "Admins can update all profiles" ON profiles
    FOR UPDATE USING (is_admin());

CREATE POLICY "Admins can insert profiles" ON profiles
    FOR INSERT WITH CHECK (is_admin());

-- Update all other admin policies to use the function
DROP POLICY IF EXISTS "Admins have full access" ON students;
DROP POLICY IF EXISTS "Admins have full access" ON companies;
DROP POLICY IF EXISTS "Admins have full access" ON internships;
DROP POLICY IF EXISTS "Admins have full access" ON applications;
DROP POLICY IF EXISTS "Admins have full access" ON allocations;
DROP POLICY IF EXISTS "Admins have full access" ON feedback;
DROP POLICY IF EXISTS "Admins have full access" ON admins;
DROP POLICY IF EXISTS "Admins have full access" ON notifications;
DROP POLICY IF EXISTS "Admins have full access" ON chatbot_conversations;
DROP POLICY IF EXISTS "Admins have full access" ON skills_catalog;
DROP POLICY IF EXISTS "Admins have full access" ON email_templates;
DROP POLICY IF EXISTS "Admins have full access" ON audit_logs;
DROP POLICY IF EXISTS "Admins have full access" ON system_settings;

-- Create new admin policies using the function
CREATE POLICY "Admins have full access" ON students
    FOR ALL USING (is_admin());

CREATE POLICY "Admins have full access" ON companies
    FOR ALL USING (is_admin());

CREATE POLICY "Admins have full access" ON internships
    FOR ALL USING (is_admin());

CREATE POLICY "Admins have full access" ON applications
    FOR ALL USING (is_admin());

CREATE POLICY "Admins have full access" ON allocations
    FOR ALL USING (is_admin());

CREATE POLICY "Admins have full access" ON feedback
    FOR ALL USING (is_admin());

CREATE POLICY "Admins have full access" ON admins
    FOR ALL USING (is_admin());

CREATE POLICY "Admins have full access" ON notifications
    FOR ALL USING (is_admin());

CREATE POLICY "Admins have full access" ON chatbot_conversations
    FOR ALL USING (is_admin());

CREATE POLICY "Admins have full access" ON skills_catalog
    FOR ALL USING (is_admin());

CREATE POLICY "Admins have full access" ON email_templates
    FOR ALL USING (is_admin());

CREATE POLICY "Admins have full access" ON audit_logs
    FOR ALL USING (is_admin());

CREATE POLICY "Admins have full access" ON system_settings
    FOR ALL USING (is_admin());
