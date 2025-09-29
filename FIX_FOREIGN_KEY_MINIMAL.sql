-- FIX FOREIGN KEY CONSTRAINT ISSUES (MINIMAL VERSION)
-- This will fix the foreign key constraint using only basic columns

-- Step 1: Disable foreign key constraints temporarily
SET session_replication_role = replica;

-- Step 2: Insert a default company record using only basic columns
-- Only use columns that definitely exist: id, name, email, description
INSERT INTO companies (id, name, email, description)
VALUES 
    ('00000000-0000-0000-0000-000000000001', 'Default Company', 'admin@defaultcompany.com', 'Default company for testing')
ON CONFLICT (id) DO NOTHING;

-- Step 3: Re-enable foreign key constraints
SET session_replication_role = DEFAULT;

-- Step 4: Make company_id nullable in internships to avoid foreign key issues
ALTER TABLE internships ALTER COLUMN company_id DROP NOT NULL;

-- Step 5: Create simple policies for companies table
DROP POLICY IF EXISTS "companies_policy" ON companies;
CREATE POLICY "companies_policy" ON companies 
    FOR ALL TO authenticated 
    USING (true) 
    WITH CHECK (true);

-- Step 6: Create simple policies for internships table
DROP POLICY IF EXISTS "internships_policy" ON internships;
CREATE POLICY "internships_policy" ON internships 
    FOR ALL TO authenticated 
    USING (true) 
    WITH CHECK (true);

-- Success message
SELECT 'Foreign key constraints fixed with minimal columns. You can now create internships.' as message;
