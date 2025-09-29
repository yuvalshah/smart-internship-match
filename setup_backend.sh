#!/bin/bash

echo "🚀 Setting up SmartPM Resume Analyzer Backend..."

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.7+ first."
    exit 1
fi

# Create virtual environment
echo "📦 Creating virtual environment..."
cd backend
python3 -m venv venv

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "📥 Installing dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

echo "✅ Backend setup complete!"
echo ""
echo "To start the backend server:"
echo "  cd backend"
echo "  source venv/bin/activate"
echo "  python start_server.py"
echo ""
echo "The API will be available at: http://localhost:8000"
echo "API Documentation: http://localhost:8000/docs"