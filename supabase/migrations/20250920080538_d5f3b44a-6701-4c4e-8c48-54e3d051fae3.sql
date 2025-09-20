-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom enums
CREATE TYPE application_status AS ENUM ('pending', 'accepted', 'rejected');
CREATE TYPE admin_role AS ENUM ('superadmin', 'placement_officer', 'reviewer');
CREATE TYPE allocation_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE internship_type AS ENUM ('onsite', 'remote', 'hybrid');
CREATE TYPE notification_type AS ENUM ('application', 'allocation', 'deadline', 'system', 'alert');
CREATE TYPE user_type AS ENUM ('student', 'admin', 'company');
CREATE TYPE message_type AS ENUM ('text', 'quick_reply', 'suggestion');
CREATE TYPE email_category AS ENUM ('application', 'allocation', 'notification', 'reminder');
CREATE TYPE data_type AS ENUM ('string', 'number', 'boolean', 'json');

-- Create tables
CREATE TABLE admins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role admin_role DEFAULT 'reviewer',
    phone_number TEXT,
    department TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMPTZ,
    permissions JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

CREATE TABLE students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    cgpa NUMERIC(3,2) CHECK (cgpa >= 0 AND cgpa <= 10),
    skills TEXT[] DEFAULT '{}',
    resume_url TEXT,
    phone_number TEXT,
    department TEXT,
    academic_year INTEGER CHECK (academic_year BETWEEN 1 AND 5),
    enrollment_number TEXT UNIQUE,
    date_of_birth DATE,
    address TEXT,
    linkedin_url TEXT,
    github_url TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    verification_token TEXT,
    last_login TIMESTAMPTZ,
    preferences JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT valid_cgpa CHECK (cgpa IS NULL OR (cgpa >= 0 AND cgpa <= 10))
);

CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    description TEXT,
    phone_number TEXT,
    website_url TEXT,
    industry TEXT,
    company_size TEXT,
    headquarters_location TEXT,
    contact_person_name TEXT,
    contact_person_position TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    logo_url TEXT,
    social_media_links JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

CREATE TABLE internships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    skills_required TEXT[] DEFAULT '{}',
    cgpa_requirement NUMERIC(3,2) CHECK (cgpa_requirement >= 0 AND cgpa_requirement <= 10),
    is_approved BOOLEAN DEFAULT FALSE,
    approved_by UUID REFERENCES admins(id),
    location TEXT,
    internship_type internship_type,
    duration_weeks INTEGER,
    stipend_amount NUMERIC(10,2),
    stipend_currency TEXT DEFAULT 'USD',
    application_deadline TIMESTAMPTZ,
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    available_positions INTEGER DEFAULT 1,
    filled_positions INTEGER DEFAULT 0,
    benefits TEXT[] DEFAULT '{}',
    application_process TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    views_count INTEGER DEFAULT 0,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT valid_cgpa_requirement CHECK (cgpa_requirement IS NULL OR (cgpa_requirement >= 0 AND cgpa_requirement <= 10))
);

CREATE TABLE applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    internship_id UUID REFERENCES internships(id) ON DELETE CASCADE,
    status application_status DEFAULT 'pending',
    cover_letter TEXT,
    application_notes TEXT,
    interview_date TIMESTAMPTZ,
    interview_notes TEXT,
    offer_letter_url TEXT,
    rejection_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(student_id, internship_id)
);

CREATE TABLE allocations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    internship_id UUID REFERENCES internships(id) ON DELETE CASCADE,
    allocated_by UUID REFERENCES admins(id),
    allocation_reason TEXT,
    status allocation_status DEFAULT 'pending',
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    stipend_amount NUMERIC(10,2),
    supervisor_name TEXT,
    supervisor_email TEXT,
    supervisor_phone TEXT,
    performance_rating INTEGER CHECK (performance_rating BETWEEN 1 AND 5),
    completion_certificate_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(student_id, internship_id)
);

CREATE TABLE feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    internship_id UUID REFERENCES internships(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comments TEXT,
    is_anonymous BOOLEAN DEFAULT FALSE,
    would_recommend BOOLEAN,
    learning_experience_rating INTEGER CHECK (learning_experience_rating BETWEEN 1 AND 5),
    work_environment_rating INTEGER CHECK (work_environment_rating BETWEEN 1 AND 5),
    mentorship_rating INTEGER CHECK (mentorship_rating BETWEEN 1 AND 5),
    overall_experience TEXT,
    challenges_faced TEXT,
    suggestions TEXT,
    is_approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(student_id, internship_id)
);

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    user_type user_type,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type notification_type,
    is_read BOOLEAN DEFAULT FALSE,
    related_entity_type TEXT,
    related_entity_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE chatbot_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    session_id TEXT NOT NULL,
    message TEXT NOT NULL,
    is_bot_message BOOLEAN DEFAULT FALSE,
    message_type message_type,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE skills_catalog (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    category TEXT,
    description TEXT,
    popularity_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE email_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_name TEXT UNIQUE NOT NULL,
    subject TEXT NOT NULL,
    body TEXT NOT NULL,
    variables TEXT[] DEFAULT '{}',
    category email_category,
    is_active BOOLEAN DEFAULT TRUE,
    created_by UUID REFERENCES admins(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    user_type user_type,
    action TEXT NOT NULL,
    table_name TEXT NOT NULL,
    record_id UUID,
    old_data JSONB,
    new_data JSONB,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE system_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    setting_key TEXT UNIQUE NOT NULL,
    setting_value TEXT NOT NULL,
    description TEXT,
    data_type data_type,
    is_editable BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_students_email ON students(email);
CREATE INDEX idx_students_cgpa ON students(cgpa);
CREATE INDEX idx_students_skills ON students USING GIN(skills);
CREATE INDEX idx_students_department ON students(department);
CREATE INDEX idx_students_academic_year ON students(academic_year);
CREATE INDEX idx_students_is_verified ON students(is_verified);

CREATE INDEX idx_companies_email ON companies(email);
CREATE INDEX idx_companies_name ON companies(name);
CREATE INDEX idx_companies_industry ON companies(industry);
CREATE INDEX idx_companies_is_verified ON companies(is_verified);

CREATE INDEX idx_internships_company_id ON internships(company_id);
CREATE INDEX idx_internships_is_approved ON internships(is_approved);
CREATE INDEX idx_internships_cgpa_requirement ON internships(cgpa_requirement);
CREATE INDEX idx_internships_skills_required ON internships USING GIN(skills_required);
CREATE INDEX idx_internships_location ON internships(location);
CREATE INDEX idx_internships_type ON internships(internship_type);
CREATE INDEX idx_internships_deadline ON internships(application_deadline);
CREATE INDEX idx_internships_is_active ON internships(is_active);

CREATE INDEX idx_applications_student_id ON applications(student_id);
CREATE INDEX idx_applications_internship_id ON applications(internship_id);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_student_internship ON applications(student_id, internship_id);
CREATE INDEX idx_applications_updated_at ON applications(updated_at);
CREATE INDEX idx_applications_interview_date ON applications(interview_date);

CREATE INDEX idx_allocations_student_id ON allocations(student_id);
CREATE INDEX idx_allocations_internship_id ON allocations(internship_id);
CREATE INDEX idx_allocations_status ON allocations(status);
CREATE INDEX idx_allocations_allocated_by ON allocations(allocated_by);

CREATE INDEX idx_feedback_student_id ON feedback(student_id);
CREATE INDEX idx_feedback_internship_id ON feedback(internship_id);
CREATE INDEX idx_feedback_rating ON feedback(rating);

CREATE INDEX idx_admins_email ON admins(email);
CREATE INDEX idx_admins_role ON admins(role);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);

CREATE INDEX idx_chatbot_student_id ON chatbot_conversations(student_id);
CREATE INDEX idx_chatbot_session_id ON chatbot_conversations(session_id);

CREATE INDEX idx_skills_catalog_name ON skills_catalog(name);
CREATE INDEX idx_skills_catalog_category ON skills_catalog(category);

CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_table_name ON audit_logs(table_name);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

-- Enable Row Level Security
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE internships ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE chatbot_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

-- Students policies
CREATE POLICY "Students can read own data" ON students
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Students can update own data" ON students
    FOR UPDATE USING (auth.uid() = id);

-- Companies policies
CREATE POLICY "Companies can read own data" ON companies
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Companies can update own data" ON companies
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Companies can manage internships" ON internships
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM companies
            WHERE companies.id = internships.company_id
            AND companies.id = auth.uid()
        )
    );

-- Applications policies
CREATE POLICY "Students can read own applications" ON applications
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM students
            WHERE students.id = applications.student_id
            AND students.id = auth.uid()
        )
    );

CREATE POLICY "Students can create applications" ON applications
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM students
            WHERE students.id = applications.student_id
            AND students.id = auth.uid()
        )
    );

-- Feedback policies
CREATE POLICY "Students can manage own feedback" ON feedback
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM students
            WHERE students.id = feedback.student_id
            AND students.id = auth.uid()
        )
    );

-- Admins have full access to everything
CREATE POLICY "Admins have full access" ON students
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admins
            WHERE admins.id = auth.uid()
        )
    );

CREATE POLICY "Admins have full access" ON companies
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admins
            WHERE admins.id = auth.uid()
        )
    );

CREATE POLICY "Admins have full access" ON internships
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admins
            WHERE admins.id = auth.uid()
        )
    );

CREATE POLICY "Admins have full access" ON applications
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admins
            WHERE admins.id = auth.uid()
        )
    );

CREATE POLICY "Admins have full access" ON allocations
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admins
            WHERE admins.id = auth.uid()
        )
    );

CREATE POLICY "Admins have full access" ON feedback
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admins
            WHERE admins.id = auth.uid()
        )
    );

CREATE POLICY "Admins have full access" ON admins
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admins
            WHERE admins.id = auth.uid()
        )
    );

CREATE POLICY "Admins have full access" ON notifications
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admins
            WHERE admins.id = auth.uid()
        )
    );

CREATE POLICY "Admins have full access" ON chatbot_conversations
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admins
            WHERE admins.id = auth.uid()
        )
    );

CREATE POLICY "Admins have full access" ON skills_catalog
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admins
            WHERE admins.id = auth.uid()
        )
    );

CREATE POLICY "Admins have full access" ON email_templates
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admins
            WHERE admins.id = auth.uid()
        )
    );

CREATE POLICY "Admins have full access" ON audit_logs
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admins
            WHERE admins.id = auth.uid()
        )
    );

CREATE POLICY "Admins have full access" ON system_settings
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admins
            WHERE admins.id = auth.uid()
        )
    );

-- Insert initial admin user
INSERT INTO admins (name, email, role) VALUES
('System Administrator', 'admin@university.edu', 'superadmin')
ON CONFLICT (email) DO NOTHING;

-- Insert default system settings
INSERT INTO system_settings (setting_key, setting_value, description, data_type) VALUES
('application_deadline_buffer_days', '7', 'Days before deadline to send reminders', 'number'),
('max_applications_per_student', '5', 'Maximum applications a student can submit', 'number'),
('auto_approve_internships', 'false', 'Automatically approve new internships', 'boolean'),
('feedback_reminder_days', '14', 'Days after internship end to request feedback', 'number'),
('default_internship_duration', '12', 'Default internship duration in weeks', 'number'),
('min_cgpa_requirement', '2.5', 'Minimum CGPA requirement for internships', 'number')
ON CONFLICT (setting_key) DO NOTHING;

-- Insert sample skills
INSERT INTO skills_catalog (name, category, description) VALUES
('Python', 'Programming', 'Python programming language'),
('JavaScript', 'Programming', 'JavaScript programming language'),
('React', 'Frontend', 'React.js framework'),
('Node.js', 'Backend', 'Node.js runtime environment'),
('SQL', 'Database', 'Structured Query Language'),
('Data Analysis', 'Analytics', 'Data analysis and visualization'),
('Machine Learning', 'AI/ML', 'Machine learning techniques'),
('Communication', 'Soft Skills', 'Verbal and written communication'),
('Teamwork', 'Soft Skills', 'Collaboration and team working')
ON CONFLICT (name) DO NOTHING;