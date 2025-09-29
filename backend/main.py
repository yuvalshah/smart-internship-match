#!/usr/bin/env python3
"""
FastAPI Backend for SmartPM Skills-Based Job Matching
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import pandas as pd
import re
from collections import Counter
import os
import subprocess
import tempfile
import shutil
import json
import requests
from datetime import datetime
import logging
from pathlib import Path
import platform

# Import the new matchmaking system
from matchmaking_system import (
    AdvancedMatchmakingSystem, 
    StudentProfile, 
    Internship, 
    Recommendation,
    matchmaking_system
)

# Import RAG chatbot system (optional)
import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'rag'))

# Try to import RAG model, but make it optional
try:
    from rag import RAGModel
    RAG_AVAILABLE = True
    print("✅ RAG chatbot system available")
except ImportError as e:
    print(f"⚠️ RAG chatbot system not available: {e}")
    print("   Install RAG dependencies: pip install langchain langchain-openai langchain-community chromadb")
    RAG_AVAILABLE = False
    RAGModel = None

app = FastAPI(
    title="Smart Internship Match - Integrated API", 
    description="AI-Powered Internship Matching Platform with Resume Generation and RAG Chatbot",
    version="2.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variable for dataset
jobs_df = None

# Global RAG model instance
rag_model = None

class SkillsRequest(BaseModel):
    skills: List[str]
    top_k: Optional[int] = 5

class JobMatch(BaseModel):
    job_title: str
    company: str
    similarity_score: float
    skills: str
    job_description: str
    location: Optional[str] = None
    experience: Optional[str] = None
    salary: Optional[str] = None

class MatchResponse(BaseModel):
    matches: List[JobMatch]
    total_jobs_analyzed: int
    processing_time_ms: int

# Resume Generation Models
class PersonalInfo(BaseModel):
    first_name: str
    last_name: str
    email: str
    phone: str
    address: str
    website: Optional[str] = None
    linkedin: Optional[str] = None
    github: Optional[str] = None

class Education(BaseModel):
    institution: str
    degree: str
    field_of_study: str
    graduation_date: str
    gpa: Optional[str] = None
    location: str

class WorkExperience(BaseModel):
    company: str
    position: str
    location: str
    start_date: str
    end_date: Optional[str] = None
    description: str

class Project(BaseModel):
    name: str
    description: str
    technologies: List[str]
    start_date: Optional[str] = None
    end_date: Optional[str] = None

class Skill(BaseModel):
    category: str
    skills: List[str]

class Achievement(BaseModel):
    title: str
    description: str
    date: str

class ResumeData(BaseModel):
    personal_info: PersonalInfo
    education: List[Education]
    work_experience: List[WorkExperience]
    projects: List[Project]
    skills: List[Skill]
    achievements: List[Achievement]
    template_choice: str = "professional"

def normalize_skill(skill):
    """Normalize skill names for better matching"""
    # Convert to lowercase and remove special characters
    normalized = re.sub(r'[^a-zA-Z0-9\s]', '', skill.lower().strip())
    
    # Handle common variations
    skill_mappings = {
        'js': 'javascript',
        'ts': 'typescript',
        'py': 'python',
        'ml': 'machine learning',
        'ai': 'artificial intelligence',
        'ui': 'user interface',
        'ux': 'user experience',
        'css3': 'css',
        'html5': 'html',
        'nodejs': 'node js',
        'reactjs': 'react',
        'vuejs': 'vue js',
        'angularjs': 'angular',
        'postgresql': 'postgres',
        'mongodb': 'mongo',
        'aws': 'amazon web services',
        'gcp': 'google cloud platform'
    }
    
    return skill_mappings.get(normalized, normalized)

def create_sample_dataset():
    """Create a sample dataset for demonstration purposes"""
    sample_jobs = [
        {
            'job_title': 'Product Management Intern',
            'company': 'Google',
            'skills': 'Product Strategy, Market Research, Data Analysis, User Experience, Agile, SQL',
            'job_description': 'Join our product team to help define and execute product strategy. Work with cross-functional teams to deliver innovative products that impact millions of users.',
            'location': 'Mountain View, CA',
            'experience': '0-1 years',
            'salary': '$8,000-$10,000/month'
        },
        {
            'job_title': 'Software Engineering Intern',
            'company': 'Microsoft',
            'skills': 'Python, JavaScript, React, SQL, Git, Cloud Computing',
            'job_description': 'Develop scalable software solutions and work with cutting-edge technologies. Collaborate with senior engineers on high-impact projects.',
            'location': 'Seattle, WA',
            'experience': '0-2 years',
            'salary': '$7,500-$9,500/month'
        },
        {
            'job_title': 'Data Science Intern',
            'company': 'Meta',
            'skills': 'Python, Machine Learning, Pandas, Scikit-learn, Statistics, SQL, Tableau',
            'job_description': 'Analyze large datasets to derive insights and build machine learning models. Work on recommendation systems and user behavior analysis.',
            'location': 'Menlo Park, CA',
            'experience': '0-1 years',
            'salary': '$8,500-$11,000/month'
        },
        {
            'job_title': 'Product Marketing Intern',
            'company': 'Apple',
            'skills': 'Marketing Strategy, Content Creation, Market Analysis, Communication, Presentation',
            'job_description': 'Support product launches and marketing campaigns. Conduct market research and create compelling product narratives.',
            'location': 'Cupertino, CA',
            'experience': '0-1 years',
            'salary': '$7,000-$9,000/month'
        },
        {
            'job_title': 'UX Design Intern',
            'company': 'Adobe',
            'skills': 'Figma, User Research, Prototyping, Adobe Creative Suite, Design Thinking',
            'job_description': 'Create user-centered designs and conduct user research. Work on improving user experience across our creative tools.',
            'location': 'San Jose, CA',
            'experience': '0-1 years',
            'salary': '$6,500-$8,500/month'
        },
        {
            'job_title': 'Business Analyst Intern',
            'company': 'Amazon',
            'skills': 'Excel, SQL, Data Analysis, Business Intelligence, PowerBI, Process Improvement',
            'job_description': 'Analyze business processes and identify optimization opportunities. Work with stakeholders to implement data-driven solutions.',
            'location': 'Seattle, WA',
            'experience': '0-1 years',
            'salary': '$6,000-$8,000/month'
        },
        {
            'job_title': 'DevOps Engineering Intern',
            'company': 'Netflix',
            'skills': 'Docker, Kubernetes, AWS, CI/CD, Linux, Python, Monitoring',
            'job_description': 'Help build and maintain cloud infrastructure. Work on deployment pipelines and monitoring systems.',
            'location': 'Los Gatos, CA',
            'experience': '0-2 years',
            'salary': '$8,000-$10,500/month'
        },
        {
            'job_title': 'Marketing Analytics Intern',
            'company': 'Spotify',
            'skills': 'Google Analytics, SQL, Python, A/B Testing, Marketing Automation, Statistics',
            'job_description': 'Analyze marketing campaign performance and user acquisition metrics. Support data-driven marketing decisions.',
            'location': 'New York, NY',
            'experience': '0-1 years',
            'salary': '$6,500-$8,500/month'
        },
        {
            'job_title': 'Frontend Development Intern',
            'company': 'Airbnb',
            'skills': 'React, JavaScript, HTML, CSS, TypeScript, Redux, Testing',
            'job_description': 'Build responsive web interfaces and improve user experience. Work on features used by millions of travelers worldwide.',
            'location': 'San Francisco, CA',
            'experience': '0-2 years',
            'salary': '$7,500-$9,500/month'
        },
        {
            'job_title': 'Financial Analyst Intern',
            'company': 'Goldman Sachs',
            'skills': 'Financial Modeling, Excel, Bloomberg, Risk Analysis, Investment Research',
            'job_description': 'Support investment research and financial analysis. Work with senior analysts on client presentations and market research.',
            'location': 'New York, NY',
            'experience': '0-1 years',
            'salary': '$8,000-$12,000/month'
        },
        {
            'job_title': 'Cybersecurity Intern',
            'company': 'Cisco',
            'skills': 'Network Security, Penetration Testing, Python, Linux, Security Frameworks',
            'job_description': 'Help protect enterprise networks and systems. Learn about threat detection and incident response.',
            'location': 'San Jose, CA',
            'experience': '0-1 years',
            'salary': '$7,000-$9,000/month'
        },
        {
            'job_title': 'Machine Learning Intern',
            'company': 'Tesla',
            'skills': 'Python, TensorFlow, PyTorch, Computer Vision, Deep Learning, Statistics',
            'job_description': 'Work on autonomous driving algorithms and computer vision systems. Contribute to cutting-edge AI research.',
            'location': 'Palo Alto, CA',
            'experience': '0-2 years',
            'salary': '$9,000-$12,000/month'
        }
    ]
    
    df = pd.DataFrame(sample_jobs)
    # Normalize skills for better matching
    df['normalized_skills'] = df['skills'].apply(lambda x: [normalize_skill(skill.strip()) for skill in x.split(',')])
    
    return df

def load_dataset():
    """Load job dataset - always use sample data for simplicity"""
    global jobs_df
    if jobs_df is None:
        print("Loading sample job dataset...")
        jobs_df = create_sample_dataset()
        print(f"Loaded {len(jobs_df)} jobs")
    
    return jobs_df

# ============================================================================
# REMOVED: Old simple skill matching algorithm
# ============================================================================
# The previous Jaccard similarity-based matching has been replaced with a
# comprehensive AI-powered matchmaking system that includes:
# - SBERT embeddings for semantic skill similarity
# - Policy-aware weighted scoring for equity
# - LinUCB contextual bandit for adaptive learning
# - Transparent explanations for each recommendation
# 
# The new system is implemented below in the new matchmaking module.
# ============================================================================

def calculate_skill_similarity(user_skills: List[str], job_skills: List[str]) -> float:
    """DEPRECATED: Old Jaccard similarity method - replaced with SBERT embeddings"""
    # This function is kept for backward compatibility but should not be used
    # for new implementations. Use the new AI-powered matching system instead.
    return 0.0

def match_jobs_by_skills(user_skills: List[str], top_k: int = 5) -> dict:
    """DEPRECATED: Old job matching method - replaced with AI-powered system"""
    # This function is kept for backward compatibility but should not be used
    # for new implementations. Use the new AI-powered matching system instead.
    return MatchResponse(
        matches=[],
        total_jobs_analyzed=0,
        processing_time_ms=0
    )

@app.get("/")
async def root():
    """Root endpoint with service overview"""
    global rag_model
    return {
        "message": "Smart Internship Match - Integrated API is running!", 
        "status": "healthy",
        "version": "2.0.0",
        "services": {
            "ai_matchmaking": "active",
            "resume_generation": "active",
            "rag_chatbot": "active" if RAG_AVAILABLE and rag_model and rag_model.rag_chain else "inactive"
        },
        "endpoints": {
            "health": "/health",
            "api_docs": "/docs",
            "matchmaking": "/api/recommendations",
            "resume": "/generate-resume",
            "chat": "/api/chat",
            "rag_health": "/api/rag-health"
        }
    }

@app.post("/match-jobs", response_model=MatchResponse)
async def match_jobs_endpoint(request: SkillsRequest):
    """Get job matches based on user skills"""
    try:
        result = match_jobs_by_skills(request.skills, request.top_k)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error matching jobs: {str(e)}")

@app.get("/health")
async def health_check():
    """Detailed health check"""
    try:
        jobs_df = load_dataset()
        global rag_model
        
        return {
            "status": "healthy",
            "dataset_loaded": jobs_df is not None,
            "total_jobs": len(jobs_df) if jobs_df is not None else 0,
            "rag_system": {
                "available": RAG_AVAILABLE,
                "initialized": rag_model is not None and rag_model.rag_chain is not None if RAG_AVAILABLE else False,
                "llm_connected": rag_model.test_connection() if rag_model and RAG_AVAILABLE else False
            },
            "services": {
                "matchmaking": "active",
                "resume_generation": "active", 
                "rag_chatbot": "active" if RAG_AVAILABLE and rag_model and rag_model.rag_chain else "inactive"
            }
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "error": str(e)
        }

# Resume Generation Classes
class ContentEnhancer:
    """Simple content enhancement without external AI"""
    
    def enhance_work_description(self, description: str) -> List[str]:
        """Convert work description into professional bullet points"""
        if not description.strip():
            return ["Contributed to team projects and organizational goals"]
        
        # Split into sentences and enhance
        sentences = [s.strip() for s in description.split('.') if s.strip()]
        enhanced_points = []
        
        for sentence in sentences:
            if sentence:
                # Add action verbs if missing
                if not any(sentence.lower().startswith(verb) for verb in 
                          ['developed', 'created', 'implemented', 'designed', 'built', 
                           'managed', 'led', 'collaborated', 'analyzed', 'optimized']):
                    sentence = f"Contributed to {sentence.lower()}"
                
                # Ensure proper capitalization
                sentence = sentence[0].upper() + sentence[1:] if len(sentence) > 1 else sentence.upper()
                
                # Add period if missing
                if not sentence.endswith('.'):
                    sentence += '.'
                
                enhanced_points.append(sentence)
        
        return enhanced_points if enhanced_points else [description]
    
    def enhance_project_description(self, description: str) -> str:
        """Enhance project description"""
        if not description.strip():
            return "Developed a comprehensive project demonstrating technical skills and problem-solving abilities."
        
        # Ensure it starts with an action verb
        action_verbs = ['Built', 'Developed', 'Created', 'Designed', 'Implemented']
        if not any(description.strip().startswith(verb) for verb in action_verbs):
            description = f"Developed {description.lower()}"
        
        return description.strip()

class LaTeXResumeGenerator:
    """Generate LaTeX resumes from structured data"""
    
    def __init__(self):
        self.enhancer = ContentEnhancer()
        self.template_dir = "../resume"
    
    def generate_professional_resume(self, resume_data: ResumeData) -> str:
        """Generate professional template LaTeX content"""
        personal = resume_data.personal_info
        
        # Build contact info
        contact_lines = []
        if personal.address:
            contact_lines.append(personal.address)
        if personal.phone and personal.email:
            contact_lines.append(f"{personal.phone} $\\cdot$ {personal.email}")
        elif personal.phone:
            contact_lines.append(personal.phone)
        elif personal.email:
            contact_lines.append(personal.email)
        
        # Build education section
        education_content = ""
        for edu in resume_data.education:
            education_content += f"""
\\textbf{{{edu.institution}}} \\hfill \\textit{{{edu.graduation_date}}} \\\\
{edu.degree} in {edu.field_of_study} \\\\
"""
            if edu.gpa:
                education_content += f"GPA: {edu.gpa} \\\\\n"
        
        # Build experience section
        experience_content = ""
        for exp in resume_data.work_experience:
            end_date = exp.end_date or "Present"
            enhanced_desc = self.enhancer.enhance_work_description(exp.description)
            
            experience_content += f"""
\\begin{{rSubsection}}{{{exp.company}}}{{{exp.start_date} - {end_date}}}{{{exp.position}}}{{{exp.location}}}
"""
            for item in enhanced_desc:
                experience_content += f"\\item {item}\n"
            experience_content += "\\end{rSubsection}\n\n"
        
        # Build projects section
        projects_content = ""
        if resume_data.projects:
            for proj in resume_data.projects:
                enhanced_desc = self.enhancer.enhance_project_description(proj.description)
                tech_list = ", ".join(proj.technologies) if proj.technologies else ""
                
                projects_content += f"""
\\begin{{rSubsection}}{{{proj.name}}}{{Personal Project}}{{Technologies: {tech_list}}}{{}}
\\item {enhanced_desc}
\\end{{rSubsection}}

"""
        
        # Build skills section
        skills_content = ""
        for skill_cat in resume_data.skills:
            skills_list = ", ".join(skill_cat.skills)
            skills_content += f"{skill_cat.category} & {skills_list} \\\\\n"
        
        # Build achievements section
        achievements_content = ""
        if resume_data.achievements:
            achievements_content = """
\\begin{rSection}{Achievements}
"""
            for achievement in resume_data.achievements:
                achievements_content += f"\\item \\textbf{{{achievement.title}}} - {achievement.description} ({achievement.date})\n"
            achievements_content += "\\end{rSection}\n"
        
        # Build the LaTeX content
        projects_section = ""
        if projects_content:
            projects_section = f"\\begin{{rSection}}{{Projects}}\n{projects_content}\n\\end{{rSection}}"
        
        return f"""
\\documentclass[11pt]{{article}}
\\usepackage[margin=0.75in]{{geometry}}
\\usepackage{{array}}
\\usepackage{{ifthen}}
\\pagestyle{{empty}}

% Resume class simulation
\\newcommand{{\\name}}[1]{{\\renewcommand{{\\name}}{{#1}}}}
\\newcommand{{\\address}}[1]{{}}
\\newenvironment{{rSection}}[1]{{
    \\medskip
    \\MakeUppercase{{\\textbf{{#1}}}}
    \\medskip
    \\hrule
    \\begin{{list}}{{}}{{
        \\setlength{{\\leftmargin}}{{1.5em}}
    }}
    \\item[]
}}{{
    \\end{{list}}
}}

\\newenvironment{{rSubsection}}[4]{{
    \\textbf{{#1}} \\hfill {{#2}}
    \\ifthenelse{{\\equal{{#3}}{{}}}}{{}}{{
        \\\\
        \\textit{{#3}} \\hfill \\textit{{#4}}
    }}%
    \\smallskip
    \\begin{{list}}{{$\\cdot$}}{{\\leftmargin=0em}}
        \\setlength{{\\itemsep}}{{-0.5em}} \\vspace{{-0.5em}}
}}{{
    \\end{{list}}
    \\vspace{{0.5em}}
}}

\\begin{{document}}

\\begin{{center}}
{{\\huge\\bfseries {personal.first_name.upper()} {personal.last_name.upper()}}}\\\\[5pt]
{chr(10).join(contact_lines)}
\\end{{center}}

\\begin{{rSection}}{{Education}}
{education_content}
\\end{{rSection}}

\\begin{{rSection}}{{Experience}}
{experience_content}
\\end{{rSection}}

{projects_section}

\\begin{{rSection}}{{Technical Strengths}}
\\begin{{tabular}}{{@{{}} >{{\\bfseries}}l @{{\\hspace{{6ex}}}} l @{{}}}}
{skills_content}
\\end{{tabular}}
\\end{{rSection}}

{achievements_content}

\\end{{document}}
"""
    
    def compile_latex_to_pdf(self, latex_content: str, resume_data: ResumeData) -> str:
        """Compile LaTeX content to PDF and return file path"""
        self.current_resume_data = resume_data  # Store for fallback use
        try:
            with tempfile.TemporaryDirectory() as temp_dir:
                # Write LaTeX file
                tex_file = os.path.join(temp_dir, "resume.tex")
                with open(tex_file, 'w', encoding='utf-8') as f:
                    f.write(latex_content)
                
                # Try to compile with pdflatex
                result = subprocess.run(
                    ["pdflatex", "-interaction=nonstopmode", "resume.tex"],
                    cwd=temp_dir,
                    capture_output=True,
                    text=True,
                    timeout=30
                )
                
                if result.returncode != 0:
                    # If pdflatex fails, try WeasyPrint fallback
                    logger.warning(f"LaTeX compilation failed: {result.stderr}")
                    return self.create_weasyprint_pdf_fallback(self.current_resume_data)
                
                pdf_file = os.path.join(temp_dir, "resume.pdf")
                if not os.path.exists(pdf_file):
                    logger.warning("PDF file was not generated by LaTeX")
                    return self.create_weasyprint_pdf_fallback(self.current_resume_data)
                
                # Copy to permanent location
                output_dir = "generated_resumes"
                os.makedirs(output_dir, exist_ok=True)
                timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
                final_pdf = os.path.join(output_dir, f"resume_{timestamp}.pdf")
                shutil.copy2(pdf_file, final_pdf)
                
                return final_pdf
                
        except subprocess.TimeoutExpired:
            logger.warning("LaTeX compilation timed out, trying WeasyPrint fallback")
            return self.create_weasyprint_pdf_fallback(resume_data)
        except Exception as e:
            logger.error(f"LaTeX compilation error: {e}, trying WeasyPrint fallback")
            return self.create_weasyprint_pdf_fallback(resume_data)
    
    def create_html_resume_fallback(self, resume_data: ResumeData, temp_dir: str) -> str:
        """Create HTML resume as fallback when LaTeX is not available"""
        personal = resume_data.personal_info
        
        # Build contact info
        contact_info = []
        if personal.email:
            contact_info.append(personal.email)
        if personal.phone:
            contact_info.append(personal.phone)
        if personal.address:
            contact_info.append(personal.address)
        
        contact_line = " • ".join(contact_info)
        
        # Build education section
        education_html = ""
        for edu in resume_data.education:
            if edu.institution:
                education_html += f"""
                <div class="item">
                    <div class="item-header">{edu.institution}</div>
                    <div class="item-subheader">{edu.degree} in {edu.field_of_study} • {edu.graduation_date}</div>
                    {f'<div>GPA: {edu.gpa}</div>' if edu.gpa else ''}
                </div>
                """
        
        # Build experience section
        experience_html = ""
        for exp in resume_data.work_experience:
            if exp.company:
                end_date = exp.end_date or "Present"
                enhanced_desc = self.enhancer.enhance_work_description(exp.description)
                
                experience_html += f"""
                <div class="item">
                    <div class="item-header">{exp.position} - {exp.company}</div>
                    <div class="item-subheader">{exp.start_date} - {end_date} • {exp.location}</div>
                    <ul>
                """
                for desc in enhanced_desc:
                    experience_html += f"<li>{desc}</li>"
                experience_html += "</ul></div>"
        
        # Build projects section
        projects_html = ""
        for proj in resume_data.projects:
            if proj.name:
                enhanced_desc = self.enhancer.enhance_project_description(proj.description)
                tech_list = ", ".join(proj.technologies) if proj.technologies else ""
                
                projects_html += f"""
                <div class="item">
                    <div class="item-header">{proj.name}</div>
                    <div class="item-subheader">Technologies: {tech_list}</div>
                    <div>{enhanced_desc}</div>
                </div>
                """
        
        # Build skills section
        skills_html = ""
        for skill_cat in resume_data.skills:
            if skill_cat.skills:
                skills_list = ", ".join(skill_cat.skills)
                skills_html += f"<div><strong>{skill_cat.category}:</strong> {skills_list}</div>"
        
        # Build achievements section
        achievements_html = ""
        for achievement in resume_data.achievements:
            if achievement.title:
                achievements_html += f"""
                <div class="item">
                    <div class="item-header">{achievement.title} ({achievement.date})</div>
                    <div>{achievement.description}</div>
                </div>
                """
        
        html_content = f"""
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Resume - {personal.first_name} {personal.last_name}</title>
    <style>
        body {{ 
            font-family: 'Georgia', 'Times New Roman', serif; 
            margin: 40px; 
            line-height: 1.6; 
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 40px;
        }}
        .header {{ 
            text-align: center; 
            margin-bottom: 40px; 
            border-bottom: 2px solid #333;
            padding-bottom: 20px;
        }}
        .name {{ 
            font-size: 32px; 
            font-weight: bold; 
            margin-bottom: 10px; 
            text-transform: uppercase;
            letter-spacing: 2px;
        }}
        .contact {{ 
            font-size: 14px; 
            color: #666; 
            margin-bottom: 10px;
        }}
        .section {{ 
            margin-bottom: 30px; 
        }}
        .section-title {{ 
            font-size: 18px; 
            font-weight: bold; 
            border-bottom: 1px solid #333; 
            margin-bottom: 15px; 
            padding-bottom: 5px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }}
        .item {{ 
            margin-bottom: 20px; 
        }}
        .item-header {{ 
            font-weight: bold; 
            font-size: 16px;
            margin-bottom: 5px;
        }}
        .item-subheader {{ 
            font-style: italic; 
            color: #666; 
            margin-bottom: 8px;
            font-size: 14px;
        }}
        ul {{ 
            margin: 8px 0; 
            padding-left: 20px; 
        }}
        li {{
            margin-bottom: 4px;
        }}
        .notice {{
            background-color: #f0f8ff;
            border: 1px solid #0066cc;
            padding: 15px;
            margin-bottom: 30px;
            border-radius: 5px;
            font-size: 14px;
        }}
        @media print {{
            body {{ margin: 20px; }}
            .notice {{ display: none; }}
        }}
    </style>
</head>
<body>
    <div class="notice">
        <strong>Note:</strong> This resume was generated in HTML format because LaTeX is not installed on the server. 
        For PDF generation, please install LaTeX (pdflatex) on your system. You can print this page as PDF using your browser.
    </div>
    
    <div class="header">
        <div class="name">{personal.first_name} {personal.last_name}</div>
        <div class="contact">{contact_line}</div>
        {f'<div class="contact">{personal.linkedin}</div>' if personal.linkedin else ''}
        {f'<div class="contact">{personal.github}</div>' if personal.github else ''}
    </div>

    {f'''<div class="section">
        <div class="section-title">Education</div>
        {education_html}
    </div>''' if education_html else ''}

    {f'''<div class="section">
        <div class="section-title">Experience</div>
        {experience_html}
    </div>''' if experience_html else ''}

    {f'''<div class="section">
        <div class="section-title">Projects</div>
        {projects_html}
    </div>''' if projects_html else ''}

    {f'''<div class="section">
        <div class="section-title">Technical Skills</div>
        {skills_html}
    </div>''' if skills_html else ''}

    {f'''<div class="section">
        <div class="section-title">Achievements</div>
        {achievements_html}
    </div>''' if achievements_html else ''}

</body>
</html>
"""
        
        html_file = os.path.join(temp_dir, "resume.html")
        with open(html_file, 'w', encoding='utf-8') as f:
            f.write(html_content)
        
        # Copy to permanent location
        output_dir = "generated_resumes"
        os.makedirs(output_dir, exist_ok=True)
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        final_html = os.path.join(output_dir, f"resume_{timestamp}.html")
        shutil.copy2(html_file, final_html)
        
        return final_html
    
    def create_weasyprint_pdf_fallback(self, resume_data: ResumeData) -> str:
        """Create PDF using WeasyPrint as fallback"""
        try:
            from weasyprint import HTML, CSS
            
            with tempfile.TemporaryDirectory() as temp_dir:
                # Generate HTML content
                html_file = self.create_html_resume_fallback(resume_data, temp_dir)
                
                # Convert HTML to PDF using WeasyPrint
                html_doc = HTML(filename=html_file)
                
                # Custom CSS for better PDF output
                pdf_css = CSS(string="""
                    @page {
                        size: A4;
                        margin: 1in;
                    }
                    .notice {
                        display: none;
                    }
                    body {
                        font-size: 11pt;
                        line-height: 1.4;
                    }
                    .name {
                        font-size: 24pt;
                    }
                    .section-title {
                        font-size: 14pt;
                        page-break-after: avoid;
                    }
                    .item {
                        page-break-inside: avoid;
                    }
                """)
                
                # Generate PDF
                output_dir = "generated_resumes"
                os.makedirs(output_dir, exist_ok=True)
                timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
                pdf_path = os.path.join(output_dir, f"resume_weasyprint_{timestamp}.pdf")
                
                html_doc.write_pdf(pdf_path, stylesheets=[pdf_css])
                
                logger.info(f"PDF generated using WeasyPrint: {pdf_path}")
                return pdf_path
                
        except ImportError:
            logger.warning("WeasyPrint not available, falling back to HTML")
            with tempfile.TemporaryDirectory() as temp_dir:
                return self.create_html_resume_fallback(resume_data, temp_dir)
        except Exception as e:
            logger.error(f"WeasyPrint PDF generation failed: {e}, falling back to HTML")
            with tempfile.TemporaryDirectory() as temp_dir:
                return self.create_html_resume_fallback(resume_data, temp_dir)

# Initialize resume generator
resume_generator = LaTeXResumeGenerator()

@app.post("/generate-resume")
async def generate_resume_endpoint(resume_data: ResumeData):
    """Generate resume from form data"""
    try:
        # Generate LaTeX content
        latex_content = resume_generator.generate_professional_resume(resume_data)
        
        # Compile to PDF (or HTML fallback)
        output_path = resume_generator.compile_latex_to_pdf(latex_content, resume_data)
        
        # Return the file (PDF or HTML)
        if output_path.endswith('.html'):
            filename = f"resume_{resume_data.personal_info.first_name}_{resume_data.personal_info.last_name}.html"
            media_type = "text/html"
        else:
            filename = f"resume_{resume_data.personal_info.first_name}_{resume_data.personal_info.last_name}.pdf"
            media_type = "application/pdf"
        
        return FileResponse(
            output_path,
            media_type=media_type,
            filename=filename
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating resume: {str(e)}")

@app.get("/resume-templates")
async def get_resume_templates():
    """Get available resume templates"""
    return {
        "templates": [
            {
                "id": "professional",
                "name": "Professional Resume",
                "description": "Clean, professional layout suitable for most industries"
            }
        ]
    }

class MacOSLaTeXManager:
    """Comprehensive LaTeX detection and management for macOS"""
    
    def __init__(self):
        self.system = platform.system()
        self.latex_paths = self._get_potential_latex_paths()
        self.detected_path = None
        
    def _get_potential_latex_paths(self):
        """Get potential LaTeX installation paths for macOS"""
        if self.system == "Darwin":  # macOS
            return [
                "/Library/TeX/texbin",
                "/usr/local/texlive/2025/bin/universal-darwin",
                "/usr/local/texlive/2024/bin/universal-darwin", 
                "/usr/local/texlive/2023/bin/universal-darwin",
                "/opt/homebrew/bin",
                "/usr/local/bin",
                "/usr/bin"
            ]
        else:
            return ["/usr/bin", "/usr/local/bin"]
    
    def detect_latex_installation(self):
        """Detect LaTeX installation with comprehensive path checking"""
        # First try current PATH
        try:
            result = subprocess.run(['pdflatex', '--version'], 
                                  capture_output=True, text=True, timeout=5)
            if result.returncode == 0:
                # Get the actual path
                path_result = subprocess.run(['which', 'pdflatex'], 
                                           capture_output=True, text=True)
                if path_result.returncode == 0:
                    self.detected_path = path_result.stdout.strip()
                    return True, f"LaTeX found in PATH: {self.detected_path}"
        except (FileNotFoundError, subprocess.TimeoutExpired):
            pass
        
        # Try potential paths
        for path in self.latex_paths:
            pdflatex_path = os.path.join(path, "pdflatex")
            if os.path.exists(pdflatex_path) and os.access(pdflatex_path, os.X_OK):
                try:
                    result = subprocess.run([pdflatex_path, '--version'], 
                                          capture_output=True, text=True, timeout=5)
                    if result.returncode == 0:
                        self.detected_path = pdflatex_path
                        return True, f"LaTeX found at: {pdflatex_path}"
                except (subprocess.TimeoutExpired, OSError):
                    continue
        
        return False, "LaTeX not found in any standard locations"
    
    def get_installation_instructions(self):
        """Get macOS-specific installation instructions"""
        if self.system == "Darwin":
            return {
                "method_1_homebrew": {
                    "title": "Install via Homebrew (Recommended)",
                    "commands": [
                        "brew install --cask mactex-no-gui",
                        "eval \"$(/usr/libexec/path_helper)\"",
                        "# Restart terminal or run: source ~/.zshrc"
                    ],
                    "description": "Installs MacTeX without GUI applications"
                },
                "method_2_full": {
                    "title": "Full MacTeX Installation",
                    "commands": [
                        "brew install --cask mactex"
                    ],
                    "description": "Installs full MacTeX with GUI applications (larger download)"
                },
                "method_3_manual": {
                    "title": "Manual Installation",
                    "url": "https://www.tug.org/mactex/",
                    "description": "Download and install MacTeX manually"
                },
                "path_fix": {
                    "title": "Fix PATH if LaTeX is installed but not found",
                    "commands": [
                        "echo 'export PATH=\"/Library/TeX/texbin:$PATH\"' >> ~/.zshrc",
                        "source ~/.zshrc",
                        "# Or run: eval \"$(/usr/libexec/path_helper)\""
                    ]
                }
            }
        else:
            return {
                "ubuntu": "sudo apt-get install texlive-latex-base texlive-latex-extra",
                "centos": "sudo yum install texlive-latex",
                "windows": "Download MiKTeX from https://miktex.org/"
            }
    
    def setup_environment_path(self):
        """Setup environment PATH for LaTeX"""
        if self.detected_path and os.path.dirname(self.detected_path) not in os.environ.get('PATH', ''):
            latex_dir = os.path.dirname(self.detected_path)
            current_path = os.environ.get('PATH', '')
            os.environ['PATH'] = f"{latex_dir}:{current_path}"
            return True
        return False

def check_latex_availability():
    """Enhanced LaTeX availability check"""
    latex_manager = MacOSLaTeXManager()
    is_available, message = latex_manager.detect_latex_installation()
    
    if is_available:
        latex_manager.setup_environment_path()
    
    return {
        "available": is_available,
        "message": message,
        "detected_path": latex_manager.detected_path,
        "installation_instructions": latex_manager.get_installation_instructions() if not is_available else None
    }

@app.get("/resume-health")
async def resume_health_check():
    """Health check for resume generation service"""
    latex_info = check_latex_availability()
    
    # Check WeasyPrint availability
    weasyprint_available = False
    try:
        import weasyprint
        weasyprint_available = True
    except ImportError:
        pass
    
    # Determine output format
    if latex_info["available"]:
        output_format = "PDF (LaTeX)"
        message = f"Ready to generate PDF resumes using LaTeX at {latex_info['detected_path']}"
    elif weasyprint_available:
        output_format = "PDF (WeasyPrint)"
        message = "LaTeX not available - will generate PDF resumes using WeasyPrint"
    else:
        output_format = "HTML"
        message = "Neither LaTeX nor WeasyPrint available - will generate HTML resumes"
    
    return {
        "status": "healthy",
        "latex_available": latex_info["available"],
        "latex_path": latex_info["detected_path"],
        "weasyprint_available": weasyprint_available,
        "output_format": output_format,
        "message": message,
        "latex_detection_message": latex_info["message"],
        "installation_instructions": latex_info["installation_instructions"],
        "system_info": {
            "platform": platform.system(),
            "python_version": platform.python_version(),
            "current_path": os.environ.get('PATH', '')[:200] + "..." if len(os.environ.get('PATH', '')) > 200 else os.environ.get('PATH', '')
        }
    }

# ============================================================================
# NEW AI-POWERED MATCHMAKING API ENDPOINTS
# ============================================================================

class StudentProfileRequest(BaseModel):
    """Request model for student profile"""
    id: str
    full_name: str
    email: str
    phone: str
    date_of_birth: str
    state: str
    district: str
    city: str
    pincode: str
    current_education: str
    university: str
    course: str
    graduation_year: str
    cgpa: str
    social_category: str
    family_income: str
    participation_type: str
    skills: List[str]
    preferred_locations: List[str]
    stipend_expectation: str
    available_duration: str
    additional_info: str

class InternshipRequest(BaseModel):
    """Request model for internship"""
    id: str
    title: str
    company: str
    description: str
    skills_required: List[str]
    cgpa_requirement: Optional[float]
    location: str
    state: str
    district: str
    city: str
    internship_type: str
    duration_weeks: int
    stipend_amount: Optional[float]
    stipend_currency: str
    application_deadline: str
    start_date: str
    end_date: str
    available_positions: int
    filled_positions: int
    benefits: List[str]
    application_process: str
    is_active: bool
    tags: List[str]
    department: str
    category: str
    company_size: str

class RecommendationResponse(BaseModel):
    """Response model for recommendations"""
    internship: InternshipRequest
    match_score: float
    rank: int
    explanation: Dict[str, Any]

class MatchmakingRequest(BaseModel):
    """Request model for matchmaking"""
    student_profile: StudentProfileRequest
    internships: List[InternshipRequest]
    top_k: Optional[int] = 10

class FeedbackRequest(BaseModel):
    """Request model for feedback"""
    student_id: str
    internship_id: str
    student_profile: StudentProfileRequest
    internship: InternshipRequest
    applied: bool
    approved: bool

# RAG Chatbot Models
class ChatRequest(BaseModel):
    message: str
    user_id: Optional[str] = "anonymous"
    session_id: Optional[str] = None
    context: Optional[str] = "internship_mentoring"

class ChatResponse(BaseModel):
    response: str
    status: str
    context_used: bool
    timestamp: str
    error: Optional[str] = None

class RAGHealthResponse(BaseModel):
    status: str
    message: str
    rag_initialized: bool
    llm_connected: bool

# RAG Chatbot Functions
def initialize_rag_model():
    """Initialize the RAG model for chatbot functionality"""
    global rag_model
    
    if not RAG_AVAILABLE:
        print("⚠️ RAG system not available - skipping initialization")
        return False
        
    try:
        print("🚀 Initializing RAG chatbot system...")
        rag_model = RAGModel()
        success = rag_model.initialize()
        
        if success:
            print("✅ RAG chatbot system initialized successfully")
            return True
        else:
            print("❌ RAG chatbot system initialization failed")
            return False
    except Exception as e:
        print(f"❌ Error initializing RAG system: {e}")
        return False

# Initialize RAG model on startup (only if available)
rag_initialized = initialize_rag_model() if RAG_AVAILABLE else False

@app.get("/api/rag-health", response_model=RAGHealthResponse)
async def rag_health_check():
    """Health check for RAG chatbot system"""
    global rag_model
    
    if not RAG_AVAILABLE:
        return RAGHealthResponse(
            status="offline",
            message="RAG system not available - dependencies not installed",
            rag_initialized=False,
            llm_connected=False
        )
    
    rag_initialized = rag_model is not None and rag_model.rag_chain is not None
    llm_connected = rag_model.test_connection() if rag_model else False
    
    return RAGHealthResponse(
        status="online" if rag_initialized else "offline",
        message="RAG Chatbot API is running" if rag_initialized else "RAG system not available",
        rag_initialized=rag_initialized,
        llm_connected=llm_connected
    )

@app.post("/api/chat", response_model=ChatResponse)
async def chat_with_mentor(request: ChatRequest):
    """Chat with AI mentor using RAG system"""
    global rag_model
    
    if not RAG_AVAILABLE:
        return ChatResponse(
            response="Sorry, the AI mentor is currently unavailable. RAG system dependencies are not installed. Please install: pip install langchain langchain-openai langchain-community chromadb",
            status="error",
            context_used=False,
            timestamp=datetime.now().isoformat(),
            error="RAG system not available"
        )
    
    if not rag_model or not rag_model.rag_chain:
        return ChatResponse(
            response="Sorry, the AI mentor is currently unavailable. Please try again later.",
            status="error",
            context_used=False,
            timestamp=datetime.now().isoformat(),
            error="RAG system not initialized"
        )
    
    try:
        # Get response from RAG system
        response = rag_model.chat(request.message)
        
        return ChatResponse(
            response=response,
            status="success",
            context_used=True,
            timestamp=datetime.now().isoformat()
        )
        
    except Exception as e:
        print(f"Error in chat endpoint: {e}")
        return ChatResponse(
            response="Sorry, I encountered an error while processing your message. Please try again.",
            status="error",
            context_used=False,
            timestamp=datetime.now().isoformat(),
            error=str(e)
        )

@app.post("/api/recommendations", response_model=List[RecommendationResponse])
async def get_recommendations(request: MatchmakingRequest):
    """Get AI-powered internship recommendations for a student"""
    try:
        # Convert request models to internal models
        student = StudentProfile(
            id=request.student_profile.id,
            full_name=request.student_profile.full_name,
            email=request.student_profile.email,
            phone=request.student_profile.phone,
            date_of_birth=request.student_profile.date_of_birth,
            state=request.student_profile.state,
            district=request.student_profile.district,
            city=request.student_profile.city,
            pincode=request.student_profile.pincode,
            current_education=request.student_profile.current_education,
            university=request.student_profile.university,
            course=request.student_profile.course,
            graduation_year=request.student_profile.graduation_year,
            cgpa=request.student_profile.cgpa,
            social_category=request.student_profile.social_category,
            family_income=request.student_profile.family_income,
            participation_type=request.student_profile.participation_type,
            skills=request.student_profile.skills,
            preferred_locations=request.student_profile.preferred_locations,
            stipend_expectation=request.student_profile.stipend_expectation,
            available_duration=request.student_profile.available_duration,
            additional_info=request.student_profile.additional_info
        )
        
        internships = []
        for internship_req in request.internships:
            internship = Internship(
                id=internship_req.id,
                title=internship_req.title,
                company=internship_req.company,
                description=internship_req.description,
                skills_required=internship_req.skills_required,
                cgpa_requirement=internship_req.cgpa_requirement,
                location=internship_req.location,
                state=internship_req.state,
                district=internship_req.district,
                city=internship_req.city,
                internship_type=internship_req.internship_type,
                duration_weeks=internship_req.duration_weeks,
                stipend_amount=internship_req.stipend_amount,
                stipend_currency=internship_req.stipend_currency,
                application_deadline=internship_req.application_deadline,
                start_date=internship_req.start_date,
                end_date=internship_req.end_date,
                available_positions=internship_req.available_positions,
                filled_positions=internship_req.filled_positions,
                benefits=internship_req.benefits,
                application_process=internship_req.application_process,
                is_active=internship_req.is_active,
                tags=internship_req.tags,
                department=internship_req.department,
                category=internship_req.category,
                company_size=internship_req.company_size
            )
            internships.append(internship)
        
        # Get recommendations
        recommendations = matchmaking_system.get_recommendations(
            student, internships, request.top_k
        )
        
        # Convert to response format
        response = []
        for rec in recommendations:
            # Convert internship back to request format
            internship_resp = InternshipRequest(
                id=rec.internship.id,
                title=rec.internship.title,
                company=rec.internship.company,
                description=rec.internship.description,
                skills_required=rec.internship.skills_required,
                cgpa_requirement=rec.internship.cgpa_requirement,
                location=rec.internship.location,
                state=rec.internship.state,
                district=rec.internship.district,
                city=rec.internship.city,
                internship_type=rec.internship.internship_type,
                duration_weeks=rec.internship.duration_weeks,
                stipend_amount=rec.internship.stipend_amount,
                stipend_currency=rec.internship.stipend_currency,
                application_deadline=rec.internship.application_deadline,
                start_date=rec.internship.start_date,
                end_date=rec.internship.end_date,
                available_positions=rec.internship.available_positions,
                filled_positions=rec.internship.filled_positions,
                benefits=rec.internship.benefits,
                application_process=rec.internship.application_process,
                is_active=rec.internship.is_active,
                tags=rec.internship.tags,
                department=rec.internship.department,
                category=rec.internship.category,
                company_size=rec.internship.company_size
            )
            
            # Convert explanation to dict
            explanation_dict = {
                "sbert_score": rec.explanation.sbert_score,
                "policy_score": rec.explanation.policy_score,
                "linucb_score": rec.explanation.linucb_score,
                "final_score": rec.explanation.final_score,
                "skill_matches": rec.explanation.skill_matches,
                "location_match": rec.explanation.location_match,
                "equity_boost": rec.explanation.equity_boost,
                "cgpa_eligibility": rec.explanation.cgpa_eligibility,
                "participation_boost": rec.explanation.participation_boost,
                "confidence": rec.explanation.confidence
            }
            
            response.append(RecommendationResponse(
                internship=internship_resp,
                match_score=rec.match_score,
                rank=rec.rank,
                explanation=explanation_dict
            ))
        
        return response
        
    except Exception as e:
        logger.error(f"Error getting recommendations: {e}")
        raise HTTPException(status_code=500, detail=f"Error getting recommendations: {str(e)}")

@app.post("/api/feedback")
async def record_feedback(request: FeedbackRequest):
    """Record student feedback for adaptive learning"""
    try:
        # Convert request models to internal models
        student = StudentProfile(
            id=request.student_profile.id,
            full_name=request.student_profile.full_name,
            email=request.student_profile.email,
            phone=request.student_profile.phone,
            date_of_birth=request.student_profile.date_of_birth,
            state=request.student_profile.state,
            district=request.student_profile.district,
            city=request.student_profile.city,
            pincode=request.student_profile.pincode,
            current_education=request.student_profile.current_education,
            university=request.student_profile.university,
            course=request.student_profile.course,
            graduation_year=request.student_profile.graduation_year,
            cgpa=request.student_profile.cgpa,
            social_category=request.student_profile.social_category,
            family_income=request.student_profile.family_income,
            participation_type=request.student_profile.participation_type,
            skills=request.student_profile.skills,
            preferred_locations=request.student_profile.preferred_locations,
            stipend_expectation=request.student_profile.stipend_expectation,
            available_duration=request.student_profile.available_duration,
            additional_info=request.student_profile.additional_info
        )
        
        internship = Internship(
            id=request.internship.id,
            title=request.internship.title,
            company=request.internship.company,
            description=request.internship.description,
            skills_required=request.internship.skills_required,
            cgpa_requirement=request.internship.cgpa_requirement,
            location=request.internship.location,
            state=request.internship.state,
            district=request.internship.district,
            city=request.internship.city,
            internship_type=request.internship.internship_type,
            duration_weeks=request.internship.duration_weeks,
            stipend_amount=request.internship.stipend_amount,
            stipend_currency=request.internship.stipend_currency,
            application_deadline=request.internship.application_deadline,
            start_date=request.internship.start_date,
            end_date=request.internship.end_date,
            available_positions=request.internship.available_positions,
            filled_positions=request.internship.filled_positions,
            benefits=request.internship.benefits,
            application_process=request.internship.application_process,
            is_active=request.internship.is_active,
            tags=request.internship.tags,
            department=request.internship.department,
            category=request.internship.category,
            company_size=request.internship.company_size
        )
        
        # Record feedback
        matchmaking_system.record_feedback(
            request.student_id,
            request.internship_id,
            student,
            internship,
            request.applied,
            request.approved
        )
        
        return {"status": "success", "message": "Feedback recorded successfully"}
        
    except Exception as e:
        logger.error(f"Error recording feedback: {e}")
        raise HTTPException(status_code=500, detail=f"Error recording feedback: {str(e)}")

@app.get("/api/matchmaking-health")
async def matchmaking_health_check():
    """Health check for the matchmaking system"""
    try:
        # Test SBERT model
        test_skills = ["Python", "Machine Learning"]
        test_description = "Software engineering internship"
        sbert_score = matchmaking_system.sbert_service.calculate_similarity(
            test_skills, ["Python"], test_description
        )
        
        return {
            "status": "healthy",
            "sbert_model": "loaded",
            "policy_scorer": "ready",
            "linucb_bandit": "ready",
            "test_sbert_score": sbert_score,
            "message": "AI-powered matchmaking system is ready"
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "error": str(e),
            "message": "Matchmaking system has issues"
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)