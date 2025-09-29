# 🎯 Smart Internship Match

> **AI-Powered Internship Matching Platform for Smart India Hackathon 2025**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104.1-green.svg)](https://fastapi.tiangolo.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue.svg)](https://www.typescriptlang.org/)

## 👥 Team
**Team Leader**: Manthan Varma  
**Technical Lead/Co-lead**: Yuval Shah  
**Frontend Architect**: Tushar Varshney  
**UI/UX Designer**: Aanannya Asati  
**Database Engineer**: Vedant Pandey  
**DevOps Engineer**: Mokshika Jain

📋 **[Complete Team Details](TEAM.md)**

## 🚀 Overview

Smart Internship Match is an intelligent platform that revolutionizes how students find and apply for internships. Using advanced AI algorithms, the platform provides personalized internship recommendations based on skills, preferences, and equity considerations.

### 🏆 Hackathon Details
- **Event**: Smart India Hackathon 2025
- **Theme**: AI-Powered Solutions for Education & Employment
- **Track**: Student Internship Matching & Career Development

## ✨ Key Features

### 🤖 AI-Powered Matching
- **SBERT Semantic Similarity**: Advanced skill matching using sentence transformers
- **Policy-Aware Scoring**: Equity and fairness considerations for all students
- **Adaptive Learning**: LinUCB contextual bandit for continuous improvement
- **Transparent Explanations**: Detailed reasoning for each recommendation

### 👥 Multi-Role Platform
- **Student Dashboard**: Profile building, recommendations, application tracking
- **Company Dashboard**: Internship posting, application management, analytics
- **Admin Dashboard**: User management, diversity monitoring, system oversight

### 📄 Smart Resume Builder
- **LaTeX PDF Generation**: Professional resume templates
- **AI Content Enhancement**: Intelligent content optimization
- **Skills Extraction**: Automatic skill identification and matching
- **Multiple Templates**: Various professional formats

### 💬 RAG-Powered Chatbot
- **Intelligent Q&A**: Context-aware responses about internships
- **Document Processing**: ChromaDB vector store with LangChain
- **Local LLM Integration**: LM Studio with phi-3.1-mini-4k-instruct

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** with custom design system
- **shadcn/ui** component library
- **Framer Motion** for animations
- **Supabase** for authentication and database

### Backend
- **FastAPI** (Python) for REST API
- **SBERT** for semantic similarity
- **scikit-learn** for machine learning
- **SQLite** for learning data storage
- **WeasyPrint** for PDF generation

### Database
- **Supabase** (PostgreSQL) with Row Level Security
- **ChromaDB** for vector storage
- **SQLite** for AI learning data

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Python 3.8+
- Git

### Option 1: Automated Setup (Recommended)
```bash
# Clone the repository
git clone https://github.com/yourusername/smart-internship-match.git
cd smart-internship-match

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
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python start_server.py
```

#### Frontend Setup (in another terminal)
```bash
npm install
npm run dev
```

#### RAG Chatbot Setup (optional)
```bash
cd rag
python3 -m venv rag_env
source rag_env/bin/activate  # On Windows: rag_env\Scripts\activate
pip install -r requirements.txt
python server.py
```

## 📱 Usage

### For Students
1. **Sign up** and complete your profile
2. **Build your resume** using the Smart Resume Builder
3. **Get AI recommendations** based on your skills and preferences
4. **Apply to internships** with one-click application
5. **Track applications** and receive notifications

### For Companies
1. **Create company profile** and verify credentials
2. **Post internship opportunities** with detailed requirements
3. **Review applications** from qualified students
4. **Manage hiring process** with built-in tools
5. **Access analytics** and insights

### For Admins
1. **Monitor platform** usage and performance
2. **Manage users** and verify credentials
3. **Track diversity metrics** and ensure equity
4. **Configure system** settings and policies

## 🧠 AI Features Deep Dive

### Matchmaking Algorithm
The platform uses a sophisticated three-tier matching system:

1. **SBERT Embeddings (40%)**: Semantic understanding of skills and requirements
2. **Policy Scoring (40%)**: Equity considerations including social category, location, income
3. **LinUCB Bandit (20%)**: Adaptive learning from user interactions

### Equity Features
- **Social Category Support**: Priority for SC/ST/OBC/EWS/PwD students
- **Location Matching**: City, district, state-based scoring
- **Income-Based Scoring**: Higher priority for lower-income families
- **Participation History**: Support for first-time vs returning participants

## 📊 API Documentation

### Core Endpoints
- `POST /api/recommendations` - Get AI-powered internship recommendations
- `POST /api/feedback` - Record user feedback for learning
- `POST /generate-resume` - Generate professional resumes
- `GET /api/matchmaking-health` - System health check

### Example API Usage
```javascript
// Get recommendations
const response = await fetch('/api/recommendations', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    student_profile: { /* student data */ },
    internships: [ /* internship data */ ],
    top_k: 10
  })
});
```

## 🗂️ Project Structure

```
smart-internship-match/
├── src/                    # React frontend
│   ├── components/         # UI components
│   ├── pages/             # Route pages
│   ├── services/          # API services
│   └── contexts/          # React contexts
├── backend/               # FastAPI backend
│   ├── main.py           # Main API server
│   ├── matchmaking_system.py  # AI matching logic
│   └── requirements.txt  # Python dependencies
├── rag/                  # RAG chatbot system
├── resume_generator/     # Resume generation service
├── supabase/            # Database migrations
└── resume/              # LaTeX templates
```

## 🧪 Testing

### Backend Tests
```bash
cd backend
python test_matchmaking_system.py
python test_resume_integration.py
```

### Frontend Tests
```bash
npm run test
```

## 📈 Performance

- **Matching Time**: ~50ms for typical skill set
- **Memory Usage**: ~50MB for dataset
- **Concurrent Users**: Supports multiple simultaneous requests
- **Scalability**: Lightweight and fast algorithms

## 🔒 Security & Privacy

- **Row Level Security**: Database-level access control
- **Input Validation**: Comprehensive data sanitization
- **CORS Protection**: Secure API endpoints
- **No Data Storage**: Resume data processed in memory only

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

### Team Leader
- **Manthan Varma** - Team Leader & Backend Developer
  - **Role**: Project Leadership, Team Coordination, Backend Development

### Technical Lead/Co-lead
- **Yuval Shah** - Technical Lead & AI Engineer
  - **Role**: Technical Leadership, AI/ML Implementation, System Architecture

### Team Members
- **Tushar Varshney** - Frontend Architect
  - **Role**: Frontend Architecture, React Development, UI/UX Implementation

- **Aanannya Asati** - UI/UX Designer
  - **Role**: User Interface Design, User Experience, Visual Design

- **Vedant Pandey** - Database Engineer
  - **Role**: Database Architecture, Query Optimization, Data Management

- **Mokshika Jain** - DevOps Engineer
  - **Role**: Deployment, Infrastructure, CI/CD, Monitoring

## 🏆 Hackathon Achievements

- ✅ **AI-Powered Matching**: Advanced semantic similarity and policy-aware scoring
- ✅ **Equity & Fairness**: Comprehensive diversity and inclusion features
- ✅ **User Experience**: Modern, responsive, and accessible design
- ✅ **Scalability**: Production-ready architecture
- ✅ **Innovation**: Novel combination of AI techniques for matching

## 📞 Support

For questions or support:
- **Email**: [your-email@example.com]
- **GitHub Issues**: [Create an issue](https://github.com/yourusername/smart-internship-match/issues)
- **Documentation**: [Project Wiki](https://github.com/yourusername/smart-internship-match/wiki)

## 🙏 Acknowledgments

- **Smart India Hackathon** for the platform and opportunity
- **Supabase** for authentication and database services
- **Hugging Face** for pre-trained models
- **Open source community** for amazing tools and libraries

---

**Built with ❤️ for Smart India Hackathon 2025**

*Empowering students with AI-driven career opportunities*