"""
Resume Generation System
FastAPI backend for generating resumes from form data using Phi-3 enhancement and LaTeX templates
"""

from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import os
import subprocess
import tempfile
import shutil
import json
import requests
from datetime import datetime
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Resume Generator API", version="1.0.0")

# CORS middleware for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # React dev servers
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models for form data
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
    relevant_coursework: Optional[List[str]] = []

class WorkExperience(BaseModel):
    company: str
    position: str
    location: str
    start_date: str
    end_date: Optional[str] = None
    description: str
    achievements: Optional[List[str]] = []

class Project(BaseModel):
    name: str
    description: str
    technologies: List[str]
    start_date: str
    end_date: Optional[str] = None
    github_url: Optional[str] = None
    live_url: Optional[str] = None

class Skill(BaseModel):
    category: str
    skills: List[str]

class Achievement(BaseModel):
    title: str
    description: str
    date: str
    organization: Optional[str] = None

class ResumeData(BaseModel):
    personal_info: PersonalInfo
    education: List[Education]
    work_experience: List[WorkExperience]
    projects: List[Project]
    skills: List[Skill]
    achievements: List[Achievement]
    template_choice: str  # 'deedy', 'graduate', 'professional'

# LM Studio configuration
LM_STUDIO_BASE_URL = "http://localhost:1234/v1"
PHI3_MODEL = "microsoft/Phi-3-mini-4k-instruct-gguf"

class Phi3Enhancer:
    """Service for enhancing resume content using Phi-3 model via LM Studio"""
    
    def __init__(self):
        self.base_url = LM_STUDIO_BASE_URL
        self.model = PHI3_MODEL
    
    def is_available(self) -> bool:
        """Check if LM Studio and Phi-3 model are available"""
        try:
            response = requests.get(f"{self.base_url}/models", timeout=5)
            return response.status_code == 200
        except:
            return False
    
    def enhance_text(self, text: str, context: str) -> str:
        """Enhance text using Phi-3 model"""
        if not self.is_available():
            logger.warning("Phi-3 model unavailable, returning original text")
            return text
        
        prompt = self._create_enhancement_prompt(text, context)
        
        try:
            response = requests.post(
                f"{self.base_url}/chat/completions",
                json={
                    "model": self.model,
                    "messages": [{"role": "user", "content": prompt}],
                    "temperature": 0.7,
                    "max_tokens": 500
                },
                timeout=30
            )
            
            if response.status_code == 200:
                result = response.json()
                enhanced_text = result["choices"][0]["message"]["content"].strip()
                return enhanced_text
            else:
                logger.error(f"Phi-3 API error: {response.status_code}")
                return text
                
        except Exception as e:
            logger.error(f"Error enhancing text with Phi-3: {e}")
            return text
    
    def _create_enhancement_prompt(self, text: str, context: str) -> str:
        """Create enhancement prompt for different contexts"""
        prompts = {
            "work_experience": f"""
Transform this work experience description into professional, achievement-oriented resume content. 
Focus on quantifiable results, action verbs, and impact. Keep it concise and powerful.

Original: {text}

Enhanced version (2-4 bullet points):""",
            
            "project_description": f"""
Rewrite this project description for a resume. Emphasize technical skills, problem-solving, 
and measurable outcomes. Use strong action verbs and technical terminology.

Original: {text}

Enhanced version (1-2 sentences):""",
            
            "achievement": f"""
Transform this achievement into compelling resume language. Focus on the impact, 
scope, and significance. Make it quantifiable if possible.

Original: {text}

Enhanced version (1 sentence):"""
        }
        
        return prompts.get(context, f"Improve this text for a professional resume: {text}")

# Initialize enhancer
phi3_enhancer = Phi3Enhancer()

class LaTeXTemplateManager:
    """Manages LaTeX template generation and compilation"""
    
    def __init__(self):
        self.template_dir = "../resume"
        self.templates = {
            "deedy": {
                "path": "LaTeXTemplates_deedy-resume-cv_v1",
                "main_file": "cv_12.tex",
                "class_file": "deedy-resume.cls"
            },
            "graduate": {
                "path": "LaTeXTemplates_medium-length-graduate-cv_v1", 
                "main_file": "cv_2.tex",
                "class_file": "res.cls"
            },
            "professional": {
                "path": "LaTeXTemplates_medium-length-professional-cv_v3",
                "main_file": "template.tex",
                "class_file": "resume.cls"
            }
        }
    
    def generate_resume(self, resume_data: ResumeData, enhanced_data: Dict[str, Any]) -> str:
        """Generate LaTeX resume from data and return PDF path"""
        template_name = resume_data.template_choice
        
        if template_name not in self.templates:
            raise ValueError(f"Unknown template: {template_name}")
        
        # Create temporary directory for compilation
        with tempfile.TemporaryDirectory() as temp_dir:
            # Copy template files
            template_info = self.templates[template_name]
            template_path = os.path.join(self.template_dir, template_info["path"])
            
            # Copy all template files to temp directory
            for file in os.listdir(template_path):
                src = os.path.join(template_path, file)
                dst = os.path.join(temp_dir, file)
                if os.path.isfile(src):
                    shutil.copy2(src, dst)
                elif os.path.isdir(src):
                    shutil.copytree(src, dst)
            
            # Generate LaTeX content based on template
            latex_content = self._generate_latex_content(template_name, resume_data, enhanced_data)
            
            # Write LaTeX file
            tex_file = os.path.join(temp_dir, "resume.tex")
            with open(tex_file, 'w', encoding='utf-8') as f:
                f.write(latex_content)
            
            # Compile to PDF
            pdf_path = self._compile_latex(temp_dir, "resume.tex")
            
            # Copy PDF to permanent location
            output_dir = "generated_resumes"
            os.makedirs(output_dir, exist_ok=True)
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            final_pdf = os.path.join(output_dir, f"resume_{timestamp}.pdf")
            shutil.copy2(pdf_path, final_pdf)
            
            return final_pdf
    
    def _generate_latex_content(self, template_name: str, resume_data: ResumeData, enhanced_data: Dict[str, Any]) -> str:
        """Generate LaTeX content for specific template"""
        if template_name == "deedy":
            return self._generate_deedy_template(resume_data, enhanced_data)
        elif template_name == "graduate":
            return self._generate_graduate_template(resume_data, enhanced_data)
        elif template_name == "professional":
            return self._generate_professional_template(resume_data, enhanced_data)
        else:
            raise ValueError(f"Template {template_name} not implemented")
    
    def _generate_deedy_template(self, resume_data: ResumeData, enhanced_data: Dict[str, Any]) -> str:
        """Generate Deedy template LaTeX content"""
        personal = resume_data.personal_info
        
        # Build contact info
        contact_info = f"{personal.email}"
        if personal.phone:
            contact_info += f" | {personal.phone}"
        if personal.website:
            contact_info = f"\\urlstyle{{same}}\\url{{{personal.website}}} \\\\ {contact_info}"
        
        # Build links section
        links = []
        if personal.github:
            links.append(f"Github:// \\href{{{personal.github}}}{{\\bf {personal.github.split('/')[-1]}}}")
        if personal.linkedin:
            links.append(f"LinkedIn:// \\href{{{personal.linkedin}}}{{\\bf {personal.linkedin.split('/')[-1]}}}")
        
        links_section = " \\\\\n".join(links) if links else "Github:// \\href{https://github.com}{\\bf github}"
        
        # Build education section
        education_content = ""
        for edu in resume_data.education:
            education_content += f"""
\\subsection{{{edu.institution}}}
\\descript{{{edu.degree}}}
\\location{{{edu.graduation_date} | {edu.location}}}
"""
            if edu.gpa:
                education_content += f"\\location{{GPA: {edu.gpa}}}\n"
            education_content += "\\sectionspace\n"
        
        # Build skills section
        skills_content = ""
        for skill_cat in resume_data.skills:
            skills_list = " \\textbullet{} ".join(skill_cat.skills)
            skills_content += f"\\location{{{skill_cat.category}:}}\n{skills_list} \\\\\n"
        
        # Build experience section
        experience_content = ""
        for exp in resume_data.work_experience:
            end_date = exp.end_date or "Present"
            experience_content += f"""
\\runsubsection{{{exp.company}}}
\\descript{{| {exp.position}}}
\\location{{{exp.start_date} – {end_date} | {exp.location}}}
"""
            # Use enhanced description if available
            desc_key = f"work_{resume_data.work_experience.index(exp)}"
            description = enhanced_data.get(desc_key, exp.description)
            
            if isinstance(description, list):
                experience_content += "\\begin{tightitemize}\n"
                for item in description:
                    experience_content += f"\\item {item}\n"
                experience_content += "\\end{tightitemize}\n"
            else:
                experience_content += f"\\vspace{{\\topsep}}\n\\begin{{tightitemize}}\n\\item {description}\n\\end{{tightitemize}}\n"
            
            experience_content += "\\sectionspace\n"
        
        # Build projects section (as Research in Deedy template)
        projects_content = ""
        for proj in resume_data.projects:
            proj_key = f"project_{resume_data.projects.index(proj)}"
            description = enhanced_data.get(proj_key, proj.description)
            
            projects_content += f"""
\\runsubsection{{{proj.name}}}
\\descript{{| Personal Project}}
\\location{{{proj.start_date} – {proj.end_date or 'Present'}}}
{description}
\\sectionspace
"""
        
        # Build awards section
        awards_content = ""
        for i, achievement in enumerate(resume_data.achievements):
            year = achievement.date.split('-')[0] if '-' in achievement.date else achievement.date
            awards_content += f"{year} & & {achievement.title}\\\\\n"
        
        return f"""
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% Deedy CV/Resume - Generated
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

\\documentclass[letterpaper]{{deedy-resume}}

\\begin{{document}}

\\lastupdated

\\namesection{{{personal.first_name}}}{{{personal.last_name}}}{{
{contact_info}
}}

\\begin{{minipage}}[t]{{0.33\\textwidth}}

\\section{{Education}}
{education_content}

\\section{{Links}}
{links_section}

\\sectionspace

\\section{{Skills}}
{skills_content}

\\end{{minipage}}
\\hfill
\\begin{{minipage}}[t]{{0.66\\textwidth}}

\\section{{Experience}}
{experience_content}

\\section{{Projects}}
{projects_content}

\\section{{Awards}}
\\begin{{tabular}}{{rll}}
{awards_content}
\\end{{tabular}}

\\end{{minipage}}

\\end{{document}}
"""
    
    def _generate_graduate_template(self, resume_data: ResumeData, enhanced_data: Dict[str, Any]) -> str:
        """Generate Graduate CV template LaTeX content"""
        personal = resume_data.personal_info
        
        # Build education section
        education_content = ""
        for edu in resume_data.education:
            education_content += f"""
{{\\sl {edu.degree},}} {edu.field_of_study} \\\\
{edu.institution}, {edu.location}, {edu.graduation_date} \\\\
"""
            if edu.gpa:
                education_content += f"GPA: {edu.gpa} \\\\\n"
        
        # Build skills section
        skills_content = ""
        for skill_cat in resume_data.skills:
            skills_list = ", ".join(skill_cat.skills)
            skills_content += f"{{\\sl {skill_cat.category}:}} {skills_list}. \\\\\n"
        
        # Build experience section
        experience_content = ""
        for exp in resume_data.work_experience:
            end_date = exp.end_date or "Present"
            desc_key = f"work_{resume_data.work_experience.index(exp)}"
            description = enhanced_data.get(desc_key, exp.description)
            
            experience_content += f"""
{{\\sl {exp.position}}} \\hfill {exp.start_date} - {end_date} \\\\
{exp.company}, {exp.location}
\\begin{{itemize}} \\itemsep -2pt
"""
            if isinstance(description, list):
                for item in description:
                    experience_content += f"\\item {item}\n"
            else:
                experience_content += f"\\item {description}\n"
            
            experience_content += "\\end{itemize}\n\n"
        
        return f"""
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% Medium Length Graduate CV - Generated
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

\\documentclass[margin, 10pt]{{res}}
\\usepackage{{helvet}}
\\setlength{{\\textwidth}}{{5.1in}}

\\begin{{document}}

\\moveleft.5\\hoffset\\centerline{{\\large\\bf {personal.first_name} {personal.last_name}}}
\\moveleft\\hoffset\\vbox{{\\hrule width\\resumewidth height 1pt}}\\smallskip
\\moveleft.5\\hoffset\\centerline{{{personal.address}}}
\\moveleft.5\\hoffset\\centerline{{{personal.phone} | {personal.email}}}

\\begin{{resume}}

\\section{{EDUCATION}}
{education_content}

\\section{{COMPUTER \\\\ SKILLS}}
{skills_content}

\\section{{EXPERIENCE}}
{experience_content}

\\end{{resume}}
\\end{{document}}
"""
    
    def _generate_professional_template(self, resume_data: ResumeData, enhanced_data: Dict[str, Any]) -> str:
        """Generate Professional template LaTeX content"""
        personal = resume_data.personal_info
        
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
            desc_key = f"work_{resume_data.work_experience.index(exp)}"
            description = enhanced_data.get(desc_key, exp.description)
            
            experience_content += f"""
\\begin{{rSubsection}}{{{exp.company}}}{{{exp.start_date} - {end_date}}}{{{exp.position}}}{{{exp.location}}}
"""
            if isinstance(description, list):
                for item in description:
                    experience_content += f"\\item {item}\n"
            else:
                experience_content += f"\\item {description}\n"
            
            experience_content += "\\end{rSubsection}\n\n"
        
        # Build skills section
        skills_content = ""
        for skill_cat in resume_data.skills:
            skills_list = ", ".join(skill_cat.skills)
            skills_content += f"{skill_cat.category} & {skills_list} \\\\\n"
        
        return f"""
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% Medium Length Professional CV - Generated
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

\\documentclass[11pt]{{resume}}
\\usepackage{{ebgaramond}}

\\name{{{personal.first_name} {personal.last_name}}}
\\address{{{personal.address}}}
\\address{{{personal.phone} $\\cdot$ {personal.email}}}

\\begin{{document}}

\\begin{{rSection}}{{Education}}
{education_content}
\\end{{rSection}}

\\begin{{rSection}}{{Experience}}
{experience_content}
\\end{{rSection}}

\\begin{{rSection}}{{Technical Strengths}}
\\begin{{tabular}}{{@{{}} >{{\\bfseries}}l @{{\\hspace{{6ex}}}} l @{{}}}}
{skills_content}
\\end{{tabular}}
\\end{{rSection}}

\\end{{document}}
"""
    
    def _compile_latex(self, work_dir: str, tex_file: str) -> str:
        """Compile LaTeX to PDF"""
        try:
            # Try XeLaTeX first (for Deedy template)
            result = subprocess.run(
                ["xelatex", "-interaction=nonstopmode", tex_file],
                cwd=work_dir,
                capture_output=True,
                text=True,
                timeout=60
            )
            
            if result.returncode != 0:
                # Fallback to pdflatex
                result = subprocess.run(
                    ["pdflatex", "-interaction=nonstopmode", tex_file],
                    cwd=work_dir,
                    capture_output=True,
                    text=True,
                    timeout=60
                )
            
            if result.returncode != 0:
                logger.error(f"LaTeX compilation failed: {result.stderr}")
                raise Exception(f"LaTeX compilation failed: {result.stderr}")
            
            pdf_file = tex_file.replace('.tex', '.pdf')
            pdf_path = os.path.join(work_dir, pdf_file)
            
            if not os.path.exists(pdf_path):
                raise Exception("PDF file was not generated")
            
            return pdf_path
            
        except subprocess.TimeoutExpired:
            raise Exception("LaTeX compilation timed out")
        except Exception as e:
            logger.error(f"Error compiling LaTeX: {e}")
            raise

# Initialize template manager
template_manager = LaTeXTemplateManager()

@app.get("/")
async def root():
    return {"message": "Resume Generator API", "status": "running"}

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    phi3_status = phi3_enhancer.is_available()
    return {
        "status": "healthy",
        "phi3_available": phi3_status,
        "templates": list(template_manager.templates.keys())
    }

@app.post("/generate-resume")
async def generate_resume(resume_data: ResumeData):
    """Generate resume from form data"""
    try:
        logger.info(f"Generating resume with template: {resume_data.template_choice}")
        
        # Enhance content with Phi-3
        enhanced_data = {}
        
        # Enhance work experience descriptions
        for i, exp in enumerate(resume_data.work_experience):
            enhanced_desc = phi3_enhancer.enhance_text(exp.description, "work_experience")
            # Split enhanced description into bullet points if it contains multiple sentences
            if '. ' in enhanced_desc and not enhanced_desc.startswith('•'):
                bullet_points = [s.strip() for s in enhanced_desc.split('.') if s.strip()]
                enhanced_data[f"work_{i}"] = [point + '.' if not point.endswith('.') else point for point in bullet_points]
            else:
                enhanced_data[f"work_{i}"] = enhanced_desc
        
        # Enhance project descriptions
        for i, proj in enumerate(resume_data.projects):
            enhanced_desc = phi3_enhancer.enhance_text(proj.description, "project_description")
            enhanced_data[f"project_{i}"] = enhanced_desc
        
        # Generate PDF
        pdf_path = template_manager.generate_resume(resume_data, enhanced_data)
        
        logger.info(f"Resume generated successfully: {pdf_path}")
        
        return FileResponse(
            pdf_path,
            media_type="application/pdf",
            filename=f"resume_{resume_data.personal_info.first_name}_{resume_data.personal_info.last_name}.pdf"
        )
        
    except Exception as e:
        logger.error(f"Error generating resume: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/templates")
async def get_templates():
    """Get available resume templates"""
    return {
        "templates": [
            {
                "id": "deedy",
                "name": "Deedy Resume",
                "description": "Modern, clean design with sidebar layout"
            },
            {
                "id": "graduate", 
                "name": "Graduate CV",
                "description": "Academic-focused traditional format"
            },
            {
                "id": "professional",
                "name": "Professional CV", 
                "description": "Clean professional layout"
            }
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)