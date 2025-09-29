#!/bin/bash

echo "🎯 Starting SmartPM Demo for Smart India Hackathon..."

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check if Python is installed
if ! command_exists python3; then
    echo "❌ Python 3 is not installed. Please install Python 3.7+ first."
    exit 1
fi

# Check if Node.js is installed
if ! command_exists node; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Start backend server in background
echo "🔧 Starting backend server..."
cd backend

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
    source venv/bin/activate
    pip install --upgrade pip
    pip install -r requirements.txt
else
    source venv/bin/activate
fi

# Start backend server
echo "🚀 Starting Resume Analyzer API..."
python start_server.py &
BACKEND_PID=$!

# Wait for backend to start
echo "⏳ Waiting for backend to start..."
sleep 5

# Start frontend
echo "🌐 Starting frontend..."
cd ..
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ SmartPM Demo is starting!"
echo ""
echo "🔗 Frontend: http://localhost:5173"
echo "🔗 Backend API: http://localhost:8000"
echo "📚 API Docs: http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop both servers"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "✅ Demo stopped"
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup INT TERM

# Wait for user to stop
wait