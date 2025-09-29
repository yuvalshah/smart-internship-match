# 🚀 Smart Internship Match - Complete Setup Guide

This guide will help you set up the Smart Internship Match platform for development or production deployment.

## 📋 Prerequisites

### Required Software
- **Node.js** 18+ ([Download](https://nodejs.org/))
- **Python** 3.8+ ([Download](https://python.org/))
- **Git** ([Download](https://git-scm.com/))
- **PostgreSQL** 13+ (for Supabase) or use Supabase Cloud

### Optional but Recommended
- **VS Code** with extensions:
  - ES7+ React/Redux/React-Native snippets
  - Tailwind CSS IntelliSense
  - Python
  - TypeScript Importer
- **Docker** (for containerized deployment)

## 🛠️ Installation Steps

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/smart-internship-match.git
cd smart-internship-match
```

### 2. Environment Configuration
```bash
# Copy environment template
cp env.example .env

# Edit the .env file with your configuration
nano .env  # or use your preferred editor
```

### 3. Frontend Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:8080`

### 4. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the server
python start_server.py
```

The backend API will be available at `http://localhost:8000`

### 5. Database Setup (Supabase)

#### Option A: Supabase Cloud (Recommended)
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Copy your project URL and anon key
4. Update your `.env` file with these values

#### Option B: Local Supabase
```bash
# Install Supabase CLI
npm install -g supabase

# Initialize Supabase
supabase init

# Start local Supabase
supabase start

# Run migrations
supabase db reset
```

### 6. RAG Chatbot Setup (Optional)
```bash
# Navigate to RAG directory
cd rag

# Create virtual environment
python3 -m venv rag_env

# Activate virtual environment
source rag_env/bin/activate  # On Windows: rag_env\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start RAG server
python server.py
```

The RAG server will be available at `http://localhost:8001`

## 🔧 Configuration

### Environment Variables
Update the following variables in your `.env` file:

```env
# Supabase (Required)
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# API URLs
VITE_API_BASE_URL=http://localhost:8000
VITE_RAG_API_URL=http://localhost:8001

# Development
VITE_NODE_ENV=development
VITE_DEBUG_MODE=true
```

### Database Configuration
1. **Supabase Setup**:
   - Create tables using the migration files in `supabase/migrations/`
   - Enable Row Level Security (RLS)
   - Configure authentication providers

2. **Local Database** (if not using Supabase):
   - Install PostgreSQL
   - Create database: `smart_internship_match`
   - Run migrations manually

## 🧪 Testing the Installation

### 1. Frontend Test
```bash
# Start frontend
npm run dev

# Open browser to http://localhost:8080
# You should see the landing page
```

### 2. Backend Test
```bash
# Test API health
curl http://localhost:8000/health

# Test matchmaking health
curl http://localhost:8000/api/matchmaking-health
```

### 3. Database Test
```bash
# Test Supabase connection
# Check if you can see tables in Supabase dashboard
```

### 4. Full Integration Test
```bash
# Run the demo script
./start_demo.sh
```

## 🚀 Production Deployment

### Frontend Deployment (Vercel/Netlify)
```bash
# Build the project
npm run build

# Deploy to your preferred platform
# Make sure to set environment variables
```

### Backend Deployment (Railway/Heroku/DigitalOcean)
```bash
# Install production dependencies
pip install -r requirements.txt

# Set production environment variables
# Deploy using your preferred platform
```

### Database Deployment
- Use Supabase Cloud for production
- Configure proper RLS policies
- Set up database backups
- Monitor performance

## 🐛 Troubleshooting

### Common Issues

#### 1. Node.js Version Issues
```bash
# Check Node.js version
node --version

# Use nvm to manage versions
nvm install 18
nvm use 18
```

#### 2. Python Virtual Environment Issues
```bash
# Recreate virtual environment
rm -rf venv
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

#### 3. Database Connection Issues
- Check Supabase credentials
- Verify database URL format
- Ensure RLS policies are correct
- Check network connectivity

#### 4. CORS Issues
- Verify API URLs in environment variables
- Check CORS configuration in backend
- Ensure frontend and backend are running on correct ports

#### 5. AI Model Loading Issues
- Check internet connection (models download on first use)
- Verify sufficient disk space (~400MB for models)
- Check Python dependencies installation

### Debug Mode
Enable debug mode by setting:
```env
VITE_DEBUG_MODE=true
LOG_LEVEL=debug
```

### Logs
Check logs in:
- Frontend: Browser console
- Backend: Terminal output
- RAG: `rag/server.log`

## 📊 Performance Optimization

### Frontend
- Enable gzip compression
- Use CDN for static assets
- Implement lazy loading
- Optimize bundle size

### Backend
- Use connection pooling
- Implement caching
- Optimize database queries
- Use async/await properly

### Database
- Create proper indexes
- Optimize RLS policies
- Monitor query performance
- Regular maintenance

## 🔒 Security Considerations

### Environment Variables
- Never commit `.env` files
- Use strong, unique secrets
- Rotate keys regularly
- Use different keys for different environments

### Database Security
- Enable RLS on all tables
- Use least privilege principle
- Regular security audits
- Monitor access patterns

### API Security
- Implement rate limiting
- Validate all inputs
- Use HTTPS in production
- Regular dependency updates

## 📈 Monitoring

### Application Monitoring
- Set up error tracking (Sentry)
- Monitor API response times
- Track user engagement
- Database performance metrics

### Health Checks
- Frontend: `http://localhost:8080`
- Backend: `http://localhost:8000/health`
- RAG: `http://localhost:8001/health`
- Database: Supabase dashboard

## 🆘 Getting Help

### Documentation
- Check this setup guide
- Review README.md
- Check API documentation
- Look at code comments

### Community
- GitHub Issues
- Discussion forums
- Team communication channels

### Support
- Create detailed issue reports
- Include error logs
- Describe steps to reproduce
- Provide environment details

## ✅ Verification Checklist

Before considering setup complete:

- [ ] Frontend loads without errors
- [ ] Backend API responds to health checks
- [ ] Database connection established
- [ ] User authentication works
- [ ] AI matching system functional
- [ ] Resume generation works
- [ ] All tests pass
- [ ] Environment variables configured
- [ ] Logs show no critical errors
- [ ] Performance is acceptable

## 🎉 Success!

If all checks pass, you're ready to start developing or deploying Smart Internship Match!

---

**Need help?** Create an issue on GitHub or contact the development team.

**Happy coding! 🚀**
