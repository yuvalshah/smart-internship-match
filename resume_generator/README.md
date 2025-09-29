# Smart Resume Builder

A complete resume generation system that uses AI enhancement via Phi-3 model and LaTeX templates to create professional resumes.

## Features

- 5-step form for collecting resume data
- AI-powered content enhancement using Phi-3 via LM Studio
- Three professional LaTeX templates (Deedy, Graduate CV, Professional CV)
- PDF generation and download
- React frontend integration
- Fallback to original content if AI is unavailable

## Prerequisites

1. **Python 3.8+**
2. **LaTeX Distribution** (for PDF compilation):
   - **macOS**: Install MacTeX: `brew install --cask mactex`
   - **Linux**: Install TeX Live: `sudo apt-get install texlive-full`
   - **Windows**: Install MiKTeX or TeX Live

3. **LM Studio** (optional, for AI enhancement):
   - Download from [https://lmstudio.ai/](https://lmstudio.ai/)
   - Download and load the Phi-3-mini-4k-instruct model
   - Start the local server on port 1234

## Installation

1. **Clone/Setup the project**:
   ```bash
   cd resume_generator
   ```

2. **Install Python dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Verify LaTeX installation**:
   ```bash
   # Test if LaTeX is working
   which pdflatex
   which xelatex
   ```

## Usage

### 1. Start the Backend API

```bash
python main.py
```

The API will be available at `http://localhost:8000`

### 2. API Endpoints

- `GET /` - Health check
- `GET /health` - System status including Phi-3 availability
- `GET /templates` - Available resume templates
- `POST /generate-resume` - Generate resume from form data

### 3. Frontend Integration

The React component `ResumeBuilder.jsx` provides a complete 5-step form interface:

1. **Personal Information** - Name, contact details, social links
2. **Education** - Degrees, institutions, GPAs
3. **Work Experience** - Jobs with AI-enhanced descriptions
4. **Projects & Skills** - Technical projects and skill categories
5. **Template Selection** - Choose from 3 professional templates

### 4. Template Options

1. **Deedy Resume** (`deedy`):
   - Modern, clean design with sidebar layout
   - Best for: Tech professionals, creative fields
   - Features: Custom fonts, two-column layout

2. **Graduate CV** (`graduate`):
   - Academic-focused traditional format
   - Best for: Academic positions, research roles
   - Features: Clean, formal structure

3. **Professional CV** (`professional`):
   - Clean professional layout
   - Best for: Corporate positions, general use
   - Features: Simple, readable design

## AI Enhancement

The system uses Phi-3 model via LM Studio to enhance:

- **Work Experience**: Transforms basic job descriptions into achievement-oriented bullet points
- **Project Descriptions**: Improves technical project descriptions with better terminology
- **Content Optimization**: Uses professional language and quantifiable results

### Setting up LM Studio (Optional)

1. Download LM Studio from [https://lmstudio.ai/](https://lmstudio.ai/)
2. Install and open LM Studio
3. Search for and download "microsoft/Phi-3-mini-4k-instruct-gguf"
4. Load the model and start the local server
5. Ensure it's running on `http://localhost:1234`

If LM Studio is not available, the system will use the original text with basic formatting.

## API Usage Examples

### Generate Resume

```bash
curl -X POST "http://localhost:8000/generate-resume" \
  -H "Content-Type: application/json" \
  -d '{
    "personal_info": {
      "first_name": "John",
      "last_name": "Doe",
      "email": "john.doe@email.com",
      "phone": "(555) 123-4567",
      "address": "123 Main St, City, State 12345"
    },
    "education": [{
      "institution": "University of Technology",
      "degree": "Bachelor of Science",
      "field_of_study": "Computer Science",
      "graduation_date": "May 2024",
      "location": "City, State",
      "gpa": "3.8"
    }],
    "work_experience": [{
      "company": "Tech Corp",
      "position": "Software Developer Intern",
      "location": "City, State",
      "start_date": "June 2023",
      "end_date": "August 2023",
      "description": "Worked on web applications using React and Node.js"
    }],
    "projects": [{
      "name": "E-commerce Website",
      "description": "Built a full-stack e-commerce platform",
      "technologies": ["React", "Node.js", "MongoDB"],
      "start_date": "January 2024"
    }],
    "skills": [{
      "category": "Programming Languages",
      "skills": ["JavaScript", "Python", "Java"]
    }],
    "achievements": [{
      "title": "Dean's List",
      "description": "Achieved Dean's List for academic excellence",
      "date": "2023"
    }],
    "template_choice": "professional"
  }' \
  --output resume.pdf
```

### Check System Health

```bash
curl http://localhost:8000/health
```

Response:
```json
{
  "status": "healthy",
  "phi3_available": true,
  "templates": ["deedy", "graduate", "professional"]
}
```

## Troubleshooting

### LaTeX Compilation Issues

1. **Missing LaTeX packages**: Install full LaTeX distribution
2. **Font issues with Deedy template**: Ensure XeLaTeX is installed
3. **Permission errors**: Check write permissions in the working directory

### AI Enhancement Issues

1. **Phi-3 not available**: System will fallback to original text
2. **LM Studio connection**: Verify LM Studio is running on port 1234
3. **Model loading**: Ensure Phi-3-mini-4k-instruct model is loaded in LM Studio

### Common Errors

- **"xelatex not found"**: Install XeLaTeX or use pdflatex fallback
- **"Connection refused"**: LM Studio is not running or wrong port
- **"Template not found"**: Check template_choice parameter

## File Structure

```
resume_generator/
├── main.py                 # FastAPI backend
├── requirements.txt        # Python dependencies
├── README.md              # This file
├── frontend/
│   └── ResumeBuilder.jsx  # React component
├── generated_resumes/     # Output directory (created automatically)
└── ../resume/             # LaTeX templates directory
    ├── LaTeXTemplates_deedy-resume-cv_v1/
    ├── LaTeXTemplates_medium-length-graduate-cv_v1/
    └── LaTeXTemplates_medium-length-professional-cv_v3/
```

## Development

To extend the system:

1. **Add new templates**: Create template generation method in `LaTeXTemplateManager`
2. **Enhance AI prompts**: Modify prompts in `Phi3Enhancer._create_enhancement_prompt()`
3. **Add form fields**: Update Pydantic models and frontend components
4. **Custom styling**: Modify LaTeX templates or create new ones

## License

This project uses LaTeX templates with various licenses. Please check individual template licenses before commercial use.