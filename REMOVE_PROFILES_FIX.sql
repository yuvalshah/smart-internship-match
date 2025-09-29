-- REMOVE PROFILES TABLE AND FIX RLS RECURSION
-- This will remove the profiles table and use existing students/companies tables

-- Step 1: Drop the profiles table completely
DROP TABLE IF EXISTS profiles CASCADE;

-- Step 2: Drop all policies that reference profiles
DROP POLICY IF EXISTS "profiles_select_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_insert_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_update_policy" ON profiles;
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "profiles_simple_select" ON profiles;
DROP POLICY IF EXISTS "profiles_simple_insert" ON profiles;
DROP POLICY IF EXISTS "profiles_simple_update" ON profiles;

-- Step 3: Drop the handle_new_user function that references profiles
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- Step 4: Drop the trigger that uses profiles
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Step 5: Create simple policies for existing tables
-- Students table
DROP POLICY IF EXISTS "students_select_policy" ON students;
DROP POLICY IF EXISTS "students_insert_policy" ON students;
DROP POLICY IF EXISTS "students_update_policy" ON students;
DROP POLICY IF EXISTS "Students can read own data" ON students;
DROP POLICY IF EXISTS "Students can update own data" ON students;
DROP POLICY IF EXISTS "students_simple_select" ON students;
DROP POLICY IF EXISTS "students_simple_insert" ON students;
DROP POLICY IF EXISTS "students_simple_update" ON students;

CREATE POLICY "students_allow_all" ON students
    FOR ALL USING (true);

-- Companies table
DROP POLICY IF EXISTS "companies_select_policy" ON companies;
DROP POLICY IF EXISTS "companies_insert_policy" ON companies;
DROP POLICY IF EXISTS "companies_update_policy" ON companies;
DROP POLICY IF EXISTS "Companies can read own data" ON companies;
DROP POLICY IF EXISTS "Companies can update own data" ON companies;
DROP POLICY IF EXISTS "companies_simple_select" ON companies;
DROP POLICY IF EXISTS "companies_simple_insert" ON companies;
DROP POLICY IF EXISTS "companies_simple_update" ON companies;

CREATE POLICY "companies_allow_all" ON companies
    FOR ALL USING (true);

-- Applications table
DROP POLICY IF EXISTS "applications_select_policy" ON applications;
DROP POLICY IF EXISTS "applications_insert_policy" ON applications;
DROP POLICY IF EXISTS "applications_update_policy" ON applications;
DROP POLICY IF EXISTS "Students can read own applications" ON applications;
DROP POLICY IF EXISTS "Students can create applications" ON applications;
DROP POLICY IF EXISTS "Students can update own applications" ON applications;
DROP POLICY IF EXISTS "Companies can read applications for their internships" ON applications;
DROP POLICY IF EXISTS "applications_simple_select" ON applications;
DROP POLICY IF EXISTS "applications_simple_insert" ON applications;
DROP POLICY IF EXISTS "applications_simple_update" ON applications;

CREATE POLICY "applications_allow_all" ON applications
    FOR ALL USING (true);

-- Internships table
DROP POLICY IF EXISTS "internships_select_policy" ON internships;
DROP POLICY IF EXISTS "internships_insert_policy" ON internships;
DROP POLICY IF EXISTS "internships_update_policy" ON internships;
DROP POLICY IF EXISTS "internships_delete_policy" ON internships;
DROP POLICY IF EXISTS "Anyone can read internships" ON internships;
DROP POLICY IF EXISTS "Companies can manage internships" ON internships;
DROP POLICY IF EXISTS "internships_simple_select" ON internships;
DROP POLICY IF EXISTS "internships_simple_insert" ON internships;
DROP POLICY IF EXISTS "internships_simple_update" ON internships;
DROP POLICY IF EXISTS "internships_simple_delete" ON internships;

CREATE POLICY "internships_allow_all" ON internships
    FOR ALL USING (true);

-- Notifications table
DROP POLICY IF EXISTS "notifications_select_policy" ON notifications;
DROP POLICY IF EXISTS "notifications_insert_policy" ON notifications;
DROP POLICY IF EXISTS "notifications_update_policy" ON notifications;
DROP POLICY IF EXISTS "Anyone can read notifications" ON notifications;
DROP POLICY IF EXISTS "Anyone can insert notifications" ON notifications;
DROP POLICY IF EXISTS "Anyone can update own notifications" ON notifications;
DROP POLICY IF EXISTS "notifications_simple_select" ON notifications;
DROP POLICY IF EXISTS "notifications_simple_insert" ON notifications;
DROP POLICY IF EXISTS "notifications_simple_update" ON notifications;

CREATE POLICY "notifications_allow_all" ON notifications
    FOR ALL USING (true);

-- Other tables
CREATE POLICY "allocations_allow_all" ON allocations
    FOR ALL USING (true);

CREATE POLICY "feedback_allow_all" ON feedback
    FOR ALL USING (true);

CREATE POLICY "admins_allow_all" ON admins
    FOR ALL USING (true);

CREATE POLICY "audit_logs_allow_all" ON audit_logs
    FOR ALL USING (true);

CREATE POLICY "chatbot_conversations_allow_all" ON chatbot_conversations
    FOR ALL USING (true);

CREATE POLICY "email_templates_allow_all" ON email_templates
    FOR ALL USING (true);

CREATE POLICY "skills_catalog_allow_all" ON skills_catalog
    FOR ALL USING (true);

CREATE POLICY "system_settings_allow_all" ON system_settings
    FOR ALL USING (true);
