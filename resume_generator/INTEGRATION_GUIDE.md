# Integration Guide: Smart Resume Builder

This guide explains how to integrate the Smart Resume Builder into your existing internship platform.

## Architecture Overview

```
Frontend (React) → FastAPI Backend → Phi-3 AI → LaTeX → PDF
     ↓                    ↓            ↓         ↓       ↓
Form Data → JSON API → Enhanced Text → .tex → resume.pdf
```

## Integration Steps

### 1. Backend Integration

#### Option A: Standalone Service
Run the resume generator as a separate microservice:

```bash
# Start the resume generator service
cd resume_generator
python main.py
# Service runs on http://localhost:8000
```

#### Option B: Embed in Existing Backend
Copy the resume generation logic into your existing backend:

```python
# In your existing FastAPI/Django/Flask app
from resume_generator.main import LaTeXTemplateManager, Phi3Enhancer

# Initialize services
template_manager = LaTeXTemplateManager()
phi3_enhancer = Phi3Enhancer()

# Add resume generation endpoint
@app.post("/api/generate-resume")
async def generate_resume(resume_data: ResumeData):
    # Your existing logic here
    pass
```

### 2. Frontend Integration

#### Option A: Use Provided React Component
```jsx
import ResumeBuilder from './resume_generator/frontend/ResumeBuilder';

function InternshipPlatform() {
  return (
    <div>
      {/* Your existing components */}
      <ResumeBuilder />
    </div>
  );
}
```

#### Option B: Custom Integration
```jsx
import axios from 'axios';

const generateResume = async (formData) => {
  try {
    const response = await axios.post(
      'http://localhost:8000/generate-resume',
      formData,
      { responseType: 'blob' }
    );
    
    // Handle PDF download
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'resume.pdf';
    link.click();
  } catch (error) {
    console.error('Resume generation failed:', error);
  }
};
```

### 3. Database Integration

#### Store Resume Data
```sql
-- Add resume table to your existing database
CREATE TABLE user_resumes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    resume_data JSONB,
    template_choice VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX idx_user_resumes_user_id ON user_resumes(user_id);
```

#### Save/Load Resume Data
```python
# Save resume data
async def save_resume_data(user_id: int, resume_data: dict):
    query = """
    INSERT INTO user_resumes (user_id, resume_data, template_choice)
    VALUES ($1, $2, $3)
    ON CONFLICT (user_id) DO UPDATE SET
        resume_data = $2,
        template_choice = $3,
        updated_at = NOW()
    """
    await database.execute(query, user_id, resume_data, resume_data['template_choice'])

# Load resume data
async def load_resume_data(user_id: int):
    query = "SELECT resume_data FROM user_resumes WHERE user_id = $1"
    result = await database.fetch_one(query, user_id)
    return result['resume_data'] if result else None
```

### 4. User Flow Integration

#### Step 1: Profile Data Pre-population
```python
def populate_resume_from_profile(user_profile):
    """Pre-populate resume form with existing user data"""
    return {
        "personal_info": {
            "first_name": user_profile.first_name,
            "last_name": user_profile.last_name,
            "email": user_profile.email,
            "phone": user_profile.phone,
            # ... other fields
        },
        "education": [
            {
                "institution": edu.school_name,
                "degree": edu.degree,
                "field_of_study": edu.major,
                # ... map your existing education data
            }
            for edu in user_profile.education
        ],
        # ... map other sections
    }
```

#### Step 2: Resume Builder Page
```jsx
function ResumeBuilderPage() {
  const [userProfile, setUserProfile] = useState(null);
  const [resumeData, setResumeData] = useState(null);

  useEffect(() => {
    // Load user profile and existing resume data
    loadUserData();
  }, []);

  const loadUserData = async () => {
    const profile = await fetchUserProfile();
    const existingResume = await fetchUserResume();
    
    setUserProfile(profile);
    setResumeData(existingResume || populateFromProfile(profile));
  };

  return (
    <div>
      <h1>Build Your Resume</h1>
      <ResumeBuilder 
        initialData={resumeData}
        onSave={saveResumeData}
        onGenerate={generateAndDownload}
      />
    </div>
  );
}
```

#### Step 3: Integration with Job Applications
```python
async def apply_to_job(user_id: int, job_id: int, include_resume: bool = False):
    application = {
        "user_id": user_id,
        "job_id": job_id,
        "applied_at": datetime.now()
    }
    
    if include_resume:
        # Generate fresh resume for this application
        resume_data = await load_resume_data(user_id)
        if resume_data:
            pdf_path = await generate_resume_pdf(resume_data)
            application["resume_file"] = pdf_path
    
    await save_job_application(application)
```

### 5. Advanced Features

#### A. Resume Templates per Industry
```python
INDUSTRY_TEMPLATES = {
    "technology": "professional",
    "academia": "graduate", 
    "creative": "deedy",
    "finance": "professional"
}

def get_recommended_template(job_posting):
    industry = job_posting.industry.lower()
    return INDUSTRY_TEMPLATES.get(industry, "professional")
```

#### B. AI-Powered Job Matching
```python
async def enhance_resume_for_job(resume_data, job_description):
    """Customize resume content based on job requirements"""
    
    # Extract key skills from job description
    job_skills = extract_skills_from_description(job_description)
    
    # Enhance work experience to highlight relevant skills
    for exp in resume_data["work_experience"]:
        enhanced_desc = phi3_enhancer.enhance_text(
            f"Job requirements: {job_skills}\nExperience: {exp['description']}",
            "job_targeted_experience"
        )
        exp["description"] = enhanced_desc
    
    return resume_data
```

#### C. Resume Analytics
```python
class ResumeAnalytics:
    def track_generation(self, user_id, template, success):
        # Track resume generation metrics
        pass
    
    def track_download(self, user_id, resume_id):
        # Track download events
        pass
    
    def get_user_stats(self, user_id):
        return {
            "resumes_generated": self.count_generations(user_id),
            "most_used_template": self.get_popular_template(user_id),
            "last_generated": self.get_last_generation(user_id)
        }
```

### 6. Environment Configuration

#### Production Setup
```python
# config.py
import os

class Config:
    # Resume Generator Settings
    RESUME_GENERATOR_URL = os.getenv("RESUME_GENERATOR_URL", "http://localhost:8000")
    LM_STUDIO_URL = os.getenv("LM_STUDIO_URL", "http://localhost:1234")
    
    # LaTeX Settings
    LATEX_TIMEOUT = int(os.getenv("LATEX_TIMEOUT", "60"))
    MAX_RESUME_SIZE = int(os.getenv("MAX_RESUME_SIZE", "10485760"))  # 10MB
    
    # File Storage
    RESUME_STORAGE_PATH = os.getenv("RESUME_STORAGE_PATH", "./generated_resumes")
    
    # AI Enhancement
    ENABLE_AI_ENHANCEMENT = os.getenv("ENABLE_AI_ENHANCEMENT", "true").lower() == "true"
```

#### Docker Deployment
```dockerfile
# Dockerfile for resume generator service
FROM python:3.9-slim

# Install LaTeX
RUN apt-get update && apt-get install -y \
    texlive-latex-base \
    texlive-latex-extra \
    texlive-fonts-recommended \
    texlive-fonts-extra \
    texlive-xetex \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 8000

CMD ["python", "main.py"]
```

### 7. Error Handling & Monitoring

#### Comprehensive Error Handling
```python
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    
    if isinstance(exc, LaTeXCompilationError):
        return JSONResponse(
            status_code=422,
            content={"error": "Resume compilation failed", "details": str(exc)}
        )
    elif isinstance(exc, AIEnhancementError):
        return JSONResponse(
            status_code=503,
            content={"error": "AI enhancement unavailable", "fallback": "using_original_text"}
        )
    
    return JSONResponse(
        status_code=500,
        content={"error": "Internal server error"}
    )
```

#### Health Monitoring
```python
@app.get("/health/detailed")
async def detailed_health():
    return {
        "status": "healthy",
        "services": {
            "latex": check_latex_availability(),
            "phi3": phi3_enhancer.is_available(),
            "storage": check_storage_space(),
            "templates": check_template_files()
        },
        "metrics": {
            "resumes_generated_today": get_daily_count(),
            "average_generation_time": get_avg_generation_time(),
            "success_rate": get_success_rate()
        }
    }
```

### 8. Testing Integration

#### Unit Tests
```python
# test_integration.py
import pytest
from your_app import create_app
from resume_generator.main import ResumeData

@pytest.fixture
def app():
    return create_app(testing=True)

def test_resume_generation_integration(app, sample_user):
    with app.test_client() as client:
        # Login user
        client.post('/login', json={'email': sample_user.email, 'password': 'test'})
        
        # Generate resume
        response = client.post('/api/generate-resume', json=sample_resume_data)
        
        assert response.status_code == 200
        assert response.headers['Content-Type'] == 'application/pdf'
```

#### End-to-End Tests
```javascript
// cypress/integration/resume_builder.spec.js
describe('Resume Builder Integration', () => {
  it('should generate resume from user profile', () => {
    cy.login('test@example.com', 'password');
    cy.visit('/resume-builder');
    
    // Form should be pre-populated
    cy.get('[data-cy=first-name]').should('have.value', 'John');
    
    // Navigate through steps
    cy.get('[data-cy=next-step]').click();
    cy.get('[data-cy=next-step]').click();
    cy.get('[data-cy=next-step]').click();
    cy.get('[data-cy=next-step]').click();
    
    // Select template and generate
    cy.get('[data-cy=template-professional]').click();
    cy.get('[data-cy=generate-resume]').click();
    
    // Should download PDF
    cy.readFile('cypress/downloads/resume.pdf').