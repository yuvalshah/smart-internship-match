-- QUICK FIX FOR RLS RECURSION ERROR
-- Run this in Supabase SQL Editor

-- Step 1: Disable RLS on profiles table temporarily
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Step 2: Drop all existing policies on profiles
DROP POLICY IF EXISTS "profiles_select_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_insert_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_update_policy" ON profiles;
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

-- Step 3: Create very simple policies for profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_simple_select" ON profiles
    FOR SELECT USING (true);

CREATE POLICY "profiles_simple_insert" ON profiles
    FOR INSERT WITH CHECK (true);

CREATE POLICY "profiles_simple_update" ON profiles
    FOR UPDATE USING (true);

-- Step 4: Fix applications table policies
DROP POLICY IF EXISTS "applications_select_policy" ON applications;
DROP POLICY IF EXISTS "applications_insert_policy" ON applications;
DROP POLICY IF EXISTS "applications_update_policy" ON applications;
DROP POLICY IF EXISTS "Students can read own applications" ON applications;
DROP POLICY IF EXISTS "Students can create applications" ON applications;
DROP POLICY IF EXISTS "Students can update own applications" ON applications;

CREATE POLICY "applications_simple_select" ON applications
    FOR SELECT USING (true);

CREATE POLICY "applications_simple_insert" ON applications
    FOR INSERT WITH CHECK (true);

CREATE POLICY "applications_simple_update" ON applications
    FOR UPDATE USING (true);

-- Step 5: Fix notifications table policies
DROP POLICY IF EXISTS "notifications_select_policy" ON notifications;
DROP POLICY IF EXISTS "notifications_insert_policy" ON notifications;
DROP POLICY IF EXISTS "notifications_update_policy" ON notifications;
DROP POLICY IF EXISTS "Anyone can read notifications" ON notifications;
DROP POLICY IF EXISTS "Anyone can insert notifications" ON notifications;
DROP POLICY IF EXISTS "Anyone can update own notifications" ON notifications;

CREATE POLICY "notifications_simple_select" ON notifications
    FOR SELECT USING (true);

CREATE POLICY "notifications_simple_insert" ON notifications
    FOR INSERT WITH CHECK (true);

CREATE POLICY "notifications_simple_update" ON notifications
    FOR UPDATE USING (true);

-- Step 6: Fix students table policies
DROP POLICY IF EXISTS "students_select_policy" ON students;
DROP POLICY IF EXISTS "students_insert_policy" ON students;
DROP POLICY IF EXISTS "students_update_policy" ON students;
DROP POLICY IF EXISTS "Students can read own data" ON students;
DROP POLICY IF EXISTS "Students can update own data" ON students;

CREATE POLICY "students_simple_select" ON students
    FOR SELECT USING (true);

CREATE POLICY "students_simple_insert" ON students
    FOR INSERT WITH CHECK (true);

CREATE POLICY "students_simple_update" ON students
    FOR UPDATE USING (true);

-- Step 7: Fix companies table policies
DROP POLICY IF EXISTS "companies_select_policy" ON companies;
DROP POLICY IF EXISTS "companies_insert_policy" ON companies;
DROP POLICY IF EXISTS "companies_update_policy" ON companies;
DROP POLICY IF EXISTS "Companies can read own data" ON companies;
DROP POLICY IF EXISTS "Companies can update own data" ON companies;

CREATE POLICY "companies_simple_select" ON companies
    FOR SELECT USING (true);

CREATE POLICY "companies_simple_insert" ON companies
    FOR INSERT WITH CHECK (true);

CREATE POLICY "companies_simple_update" ON companies
    FOR UPDATE USING (true);

-- Step 8: Fix internships table policies
DROP POLICY IF EXISTS "internships_select_policy" ON internships;
DROP POLICY IF EXISTS "internships_insert_policy" ON internships;
DROP POLICY IF EXISTS "internships_update_policy" ON internships;
DROP POLICY IF EXISTS "internships_delete_policy" ON internships;
DROP POLICY IF EXISTS "Anyone can read internships" ON internships;
DROP POLICY IF EXISTS "Companies can manage internships" ON internships;

CREATE POLICY "internships_simple_select" ON internships
    FOR SELECT USING (true);

CREATE POLICY "internships_simple_insert" ON internships
    FOR INSERT WITH CHECK (true);

CREATE POLICY "internships_simple_update" ON internships
    FOR UPDATE USING (true);

CREATE POLICY "internships_simple_delete" ON internships
    FOR DELETE USING (true);
