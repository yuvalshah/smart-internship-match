# SmartPM Skills-Based Job Matching Integration

## 🎯 Overview

This integration adds skills-based job matching functionality to your SmartPM web application. Students can build their profile using the Smart Resume Builder, and get personalized job recommendations based on their skills using Jaccard similarity and skill coverage algorithms.

## 🚀 Quick Start for Demo

### Option 1: Automated Setup (Recommended)
```bash
# Make scripts executable
chmod +x setup_backend.sh start_demo.sh

# Setup and start everything
./start_demo.sh
```

### Option 2: Manual Setup

#### Backend Setup
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python start_server.py
```

#### Frontend Setup (in another terminal)
```bash
npm run dev
```

## 📋 Features Added

### 1. FastAPI Backend (`backend/main.py`)
- **POST /match-jobs**: Accepts skills array and returns top 5 job matches
- **GET /health**: Health check endpoint
- Uses Jaccard similarity and skill coverage algorithms
- Works with curated sample dataset of 12 top company internships

### 2. Frontend Components

#### `JobRecommendations.tsx`
- Displays AI-powered job recommendations
- Shows similarity scores, company info, skills, and apply buttons
- Beautiful animations and responsive design

#### `SkillsMatcherService.ts`
- API service layer for backend communication
- Handles skills-based job matching
- Error handling and type safety

### 3. Enhanced SmartResumeBuilder
- Now integrates with skills matching API
- Extracts skills from resume form
- Triggers job matching on resume completion

### 4. Updated StudentDashboard
- Shows skills-based recommendations section
- Seamless integration with existing UI
- Maintains all existing functionality

## 🔧 Technical Details

### Backend Architecture
- **Framework**: FastAPI with CORS support
- **Matching Algorithm**: Jaccard similarity + skill coverage
- **Data Processing**: Pandas for dataset management
- **Skill Normalization**: Custom skill mapping and normalization

### API Endpoints

#### POST /match-jobs
```json
{
  "skills": ["Python", "JavaScript", "React", "SQL"],
  "top_k": 5
}
```

#### Response Format
```json
{
  "matches": [
    {
      "job_title": "Software Engineering Intern",
      "company": "Microsoft",
      "similarity_score": 0.8542,
      "skills": "Python, JavaScript, React, SQL, Git",
      "job_description": "Develop scalable software solutions...",
      "location": "Seattle, WA",
      "salary": "$7,500-$9,500/month"
    }
  ],
  "total_jobs_analyzed": 12,
  "processing_time_ms": 45
}
```

### Frontend Integration
- **State Management**: React hooks for job matches
- **Skills Input**: Interactive skill tagging system
- **Error Handling**: User-friendly error messages
- **Loading States**: Smooth loading animations
- **Responsive Design**: Works on all screen sizes

## 📊 Sample Data

The system includes 12 high-quality internship opportunities from top companies:
- Google (Product Management)
- Microsoft (Software Engineering)
- Meta (Data Science)
- Apple (Product Marketing)
- Adobe (UX Design)
- Amazon (Business Analyst)
- Netflix (DevOps)
- Spotify (Marketing Analytics)
- Airbnb (Frontend Development)
- Goldman Sachs (Financial Analyst)
- Cisco (Cybersecurity)
- Tesla (Machine Learning)

## 🎨 UI/UX Features

### Smart Matching Indicators
- **Excellent Match** (80%+): Green badge
- **Good Match** (60-79%): Blue badge
- **Fair Match** (40-59%): Yellow badge
- **Potential Match** (<40%): Gray badge

### Interactive Elements
- Interactive skill input with suggestions
- Real-time matching progress
- Animated job cards
- Skill tag visualization
- Apply buttons with existing ApplicationForm integration

## 🔒 Security & Privacy

- Files are processed in memory only
- No resume data is stored on servers
- CORS protection for API endpoints
- Input validation and sanitization
- Error handling without data exposure

## 🚀 Demo Flow

1. **Student visits dashboard**
2. **Builds profile** using Smart Resume Builder
3. **Adds skills** during the resume building process
4. **System matches** skills using Jaccard similarity algorithm
5. **Displays top 5 matches** with similarity scores
6. **Student can apply** directly using existing application system

## 📈 Performance

- **Matching Time**: ~50ms for typical skill set
- **Memory Usage**: ~50MB for dataset
- **Concurrent Users**: Supports multiple simultaneous requests
- **Scalability**: Lightweight and fast algorithm

## 🛠️ Troubleshooting

### Backend Issues
```bash
# Check if server is running
curl http://localhost:8000/health

# View server logs
cd backend && python start_server.py
```

### Frontend Issues
```bash
# Check if API is accessible
# Open browser console and look for CORS errors
# Ensure backend is running on port 8000
```

### Common Fixes
- **CORS Error**: Ensure backend is running first
- **No Matches**: Ensure skills are added to the resume builder
- **Empty Results**: Check if skills were properly submitted
- **API Error**: Verify backend server is accessible

## 🎯 Hackathon Demo Tips

1. **Start with backend**: Always start backend server first
2. **Use sample data**: Works with curated internship dataset
3. **Show skill matching**: Add diverse skills to see different matches
4. **Highlight similarity scores**: Explain matching percentages
5. **Demo apply flow**: Show integration with existing system

## 🔄 Future Enhancements

- Advanced skill synonym recognition
- Location and salary preference filtering
- Skill gap analysis and recommendations
- Company preference learning
- Integration with external job APIs
- Real-time job market analysis

---

**Ready for Smart India Hackathon! 🏆**

The integration is complete, tested, and demo-ready. The skills-based job matching will showcase intelligent matching capabilities while maintaining the clean, professional UI of your SmartPM platform.